import {Router} from 'express';
import {registerController} from "../controllers/auth.controller.js";
import {registerValidator} from "../validator/auth.Validator.js";


const authRouter = Router();

// /api/auth/register
authRouter.post('/register', registerValidator , registerController); 

export default authRouter;