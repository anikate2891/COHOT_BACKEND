import { Router } from "express";
import { register, login } from "../controller/auth.controller.js";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);

export default authRouter;  