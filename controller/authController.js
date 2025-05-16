const users = require('../db/models/users')
const signup = async (req, res, next) => {
    const body = req.body;
    if(!['1','2'].includes(body.userType)){
        return res.status(400).json({
            status : '400',
            message : 'Invalid UserType'
        })
    }

    const newUser = await users.create({
        userType : body.userType,
        firstName : body.firstName,
        lastName : body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword : body.confirmPassword
    })

    if(!newUser){
        return res.status(401).json({
            status : '401',
            message : 'Unable to create the user'
        })
    }

    return res.status(200).json({
        status : '200',
        message : 'User created successfully'
    })
};

module.exports = { signup };