import { Router } from "express";
import { registerController, loginController } from "../controller/auth.controller.js";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerController);
authRouter.post("/login", loginValidator, loginController);

export default authRouter;  