import * as Yup from 'yup';
import { startOfDay, parseISO, addMonths, isBefore } from 'date-fns';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

class RegistrationController {
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

    return res.json(registration);
  }
}

export default new RegistrationController();
