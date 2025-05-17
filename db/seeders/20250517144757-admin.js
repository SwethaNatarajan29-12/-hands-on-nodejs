'use strict';
const bcrypt = require('bcrypt');

/********************************************************************************************************************************
 * ******************************************************************************************************
 * For setting default values, we will use seeders,
 * Here we are storing default admin info in the table directly(without directing through models)
 * For deleting this data, only admin have access,
 * For validating,we are using userType '0', which is refers to admin
 * ******************************************************************************************************
 ********************************************************************************************************************************/
module.exports = {
  up: (queryInterface, Sequelize) => {
    let password = process.env.ADMIN_PASSWORD;
    let hashPassword = bcrypt.hashSync(password, 10);
    return queryInterface.bulkInsert('users', [
      {
        userType: '0',
        firstName: process.env.ADMIN_FIRSTNAME,
        lastName: process.env.ADMIN_LASTNAME,
        password: hashPassword,
        email: process.env.ADMIN_EMAIL,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { userType: '0' }, {});
  },
};
