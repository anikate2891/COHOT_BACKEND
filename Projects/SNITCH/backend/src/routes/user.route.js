import { Router } from "express";
import { registerController, loginController, googleCallbackController } from "../controller/auth.controller.js";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";
import passport from "passport";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerController);
authRouter.post("/login", loginValidator, loginController);

authRouter.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", 
    passport.authenticate("google", { session: false }), googleCallbackController);

export default authRouter;      