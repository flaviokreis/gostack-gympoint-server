import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    // The student only checkin max 5 times every 7 days
    const checkins = await Checkin.findAll({
      where: {
        student_id,
        created_at: {
          [Op.gte]: subDays(new Date(), 7)
        }
      }
    });

    if (checkins.length >= 5) {
      return res
        .status(400)
        .json({ error: 'You can only checkin 5 times per week' });
    }

    const checkin = await Checkin.create({
      student_id
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
