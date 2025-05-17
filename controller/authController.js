const user = require('../db/models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const ErrorMessages = require('../utils/error');
const users = require('../db/models/users');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/*************************************************************************************************************
 * create user only if the userType includes 1, 2 -> buyer,seller
 *************************************************************************************************************/
const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    if (!['1', '2'].includes(body.userType)) {
        throw new ErrorMessages('Invalid user Type', 400);
    }

    const newUser = await user.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
    });

    if (!newUser) {
        return next(new ErrorMessages('Failed to create the user', 400));
    }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id,
    });

    return res.status(201).json({
        status: 'success',
        data: result,
    });
});

/**************************************************************************************************************************
 * ***********************************************************************************************************
 * email and password must be provided and email should be available in table(signedUp already to login),
 * if done, will generate jwtToken
 * ***********************************************************************************************************
 **************************************************************************************************************************/
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorMessages('Please provide email and password', 400));
    }

    const result = await users.findOne({ where: { email } });
    if (!result || !(await bcrypt.compare(password, result.password))) {
        return next(new ErrorMessages('Incorrect email or password', 401));
    }

    const token = generateToken({
        id: result.id,
    });

    return res.json({
        status: 'success',
        token,
    });
});

/****************************************************************************************************************************
 * **************************************************************************
 * should pass valid Bearer Token to access internal api's
 * **************************************************************************
 ****************************************************************************************************************************/
const authentication = catchAsync(async (req, res, next) => {
    // 1. get the token from headers
    let idToken = '';
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Bearer asfdasdfhjasdflkkasdf
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
        return next(new ErrorMessages('Please login to get access', 401));
    }
    // 2. token verification
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    // 3. get the user detail from db and add to req object
    const user = await users.findByPk(tokenDetail.id);

    if (!user) {
        return next(new ErrorMessages('User no longer exists', 400));
    }
    req.user = user;
    return next();
});

/****************************************************************************************************************************
 * **********************************************************************************************************
 * restricted some internal api's with admin access only based on userType '0' which is refers to admin
 * **********************************************************************************************************
 ****************************************************************************************************************************/
const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            return next(
                new ErrorMessages(
                    "You don't have permission to perform this action",
                    403
                )
            );
        }
        return next();
    };

    return checkPermission;
};

module.exports = { signup, login, authentication, restrictTo };