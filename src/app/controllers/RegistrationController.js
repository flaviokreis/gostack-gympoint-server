import * as Yup from 'yup';
import { startOfDay, parseISO, addMonths, isBefore } from 'date-fns';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.params;

    const registrations = await Registration.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Plan,
          foreignKey: 'plan_id',
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price']
        },
        {
          model: Student,
          foreignKey: 'student_id',
          as: 'student',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .required()
        .integer()
        .positive(),
      plan_id: Yup.number()
        .required()
        .integer()
        .positive(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const startDate = startOfDay(parseISO(start_date));

    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const endDate = addMonths(startDate, plan.duration);
    const price = plan.price * plan.duration;

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      price
    });

    await Queue.add(RegistrationMail.key, {
      registration,
      student,
      plan
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive(),
      plan_id: Yup.number()
        .integer()
        .positive(),
      start_date: Yup.date()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const registration = await Registration.findByPk(req.params.id);

    const {
      student_id = registration.student_id,
      plan_id = registration.plan_id,
      start_date = registration.start_date
    } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const startDate = startOfDay(parseISO(start_date));

    const endDate = addMonths(startDate, plan.duration);
    const price = plan.price * plan.duration;

    const updatedRegistration2 = await registration.update({
      student_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      price
    });

    return res.json(updatedRegistration2);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Registration.destroy({
      where: { id }
    });

    return res.json();
  }
}

export default new RegistrationController();
