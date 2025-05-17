const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'Error';
    const message = error.message;
    const stack = error.stack;


    return res.status(statusCode).json({
        status,
        message,
        stack
    })
}

const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'Error';
    const message = error.message;


    if (error.isOperational) {
        return res.status(statusCode).json({
            status,
            message
        })
    }

    console.log(error.status, error.message, error.stack);
    return res.status(500).json({
        status: 'Error',
        message: 'Something went wrong'
    })
}



const globalErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV == 'development') {
        return sendErrorDev(err, res);
    } else {
        return sendErrorProd(err, res);
    }


}
module.exports = globalErrorHandler;