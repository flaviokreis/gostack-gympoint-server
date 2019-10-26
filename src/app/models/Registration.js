import Sequelize, { Model } from 'sequelize';

import Plan from './Plan';
import Student from './Student';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT
      },
      { sequelize }
    );
  }

  static associate() {
    Registration.belongsTo(Student, {
      foreignKey: 'student_id',
      as: 'student'
    });
    Registration.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Registration;
