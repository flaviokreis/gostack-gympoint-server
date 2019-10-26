import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Registration from '../app/models/Registration';
import Checkin from '../app/models/Checkin';

import databaseConfig from '../config/database';

const models = [User, Student, Plan, Registration, Checkin];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));

    Registration.associate();
    Checkin.associate();
  }
}

export default new Database();
