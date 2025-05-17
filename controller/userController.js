const { Sequelize } = require('sequelize');
const user = require('../db/models/users');
const catchAsync = require('../utils/catchAsync');

//this api is only accessible to admin, also we have filtered out the admin info and passwords of all users from the response , op-> operator,ne ->notEqualTo
const getAllUser = catchAsync(async (req, res, next) => {
    const users = await user.findAndCountAll({
        where: {
            userType: {
                [Sequelize.Op.ne]: '0',
            },
        },
        attributes: { exclude: ['password'] },
    });
    return res.status(200).json({
        status: 'success',
        data: users,
    });
});

module.exports = { getAllUser };