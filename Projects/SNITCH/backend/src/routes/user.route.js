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
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }), googleCallbackController);
    // Server k pass se auth code goggle k pass leke jayega & uske basics par user details lege aygea and authenticate kar dega, uske baad google callback controller me user details ko handle karenge aur response bhejenge.

export default authRouter;      