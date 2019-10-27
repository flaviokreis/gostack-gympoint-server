import Sequelize, { Model } from 'sequelize';

import Student from './Student';

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE
      },
      { sequelize }
    );

    return this;
  }

  static associate() {
    HelpOrder.belongsTo(Student, {
      foreignKey: 'student_id',
      as: 'student'
    });
  }
}

export default HelpOrder;
