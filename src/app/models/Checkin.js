import Sequelize, { Model } from 'sequelize';

import Student from './Student';

class Checkin extends Model {
  static init(sequelize) {
    super.init({ student_id: Sequelize.INTEGER }, { sequelize });

    return this;
  }

  static associate() {
    Checkin.belongsTo(Student, {
      foreignKey: 'student_id',
      as: 'student'
    });
  }
}

export default Checkin;
