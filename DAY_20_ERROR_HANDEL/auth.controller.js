import handelError from './error.middleware.js';

export async function registerUser(req, res, next) {
    try{
        throw new Error('User already exists');
    } catch(err){
        err.status = 409;
        next(err);
    }
}