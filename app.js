require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const app = express();
const authRouter = require('./router/authRouter');
const productRouter = require('./router/productRoute');
const userRouter = require('./router/userRoute');
const catchAsync = require('./utils/catchAsync');
const ErrorMessages = require('./utils/error');
const globalErrorHandler = require('./controller/errorHandler');

app.get('/', (req, res) => {
    res.status(200).json({
        status: '200',
        message: 'Success'
    })
})
app.use(express.json()); // for accepting json data as payload
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);



/************************************************************************************************************************************
 * //if any middleware is async , global error handler can't habdle those errors, we can handle this using next() with error object

    app.use(/(.*)/, async (req, res, next) => {
    return next(new Error({ status: '404', message: 'API Not Founf' }));
    // res.status(404).json({
    //     status : '404',
    //     message: 'API Not found'
    // })
    }); 
 ************************************************************************************************************************************/


app.use(/(.*)/, catchAsync(async (req, res, next) => {
    throw new ErrorMessages('This is unknown error', 404);
}));

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log("The Server is UP and listening - ", PORT);
})