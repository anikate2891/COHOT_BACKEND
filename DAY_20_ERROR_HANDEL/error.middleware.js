function hadelError(err, req, res, next) {

    res.status(err.status).json({
        message:'Something went wrong',
        error: err.message,
        stack: err.stack
    })
}

module.exports = hadelError;