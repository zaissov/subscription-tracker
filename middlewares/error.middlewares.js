const erroMiddleware = (err, req, res, next) => {
    try {
       // mongoose bad ObjectId
    if (err.name === 'CastError') {
        err.statusCode = 404;
        err.message = 'Resource not found';
    }

    // mongoose duplicate key
    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = 'Duplicate field value entered';
    }

    // mongoose validation error
    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
        
    } catch (error) {
        next(error);
        
    }
}

export default erroMiddleware;