import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnsweredMail from '../jobs/AnsweredMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async index(req, res) {
    const help_orders = await HelpOrder.findAll({
      where: {
        answer: null
      },
      attributes: ['id', 'question', 'created_at'],
      include: [
        {
          model: Student,
          foreignKey: 'student_id',
          as: 'student',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.json(help_orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.json(400).json({ error: 'Help order not found' });
    }

    const answered = await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date()
    });

    const student = await Student.findByPk(answered.student_id);

    if (student) {
      await Queue.add(AnsweredMail.key, {
        help_order: answered,
        student
      });
    }

    return res.json(answered);
  }
}

export default new HelpOrderController();
