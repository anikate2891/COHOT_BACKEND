import {body, validationResult} from "express-validator";

export const registerValidator = [
        body("email").isEmail().withMessage("Invalid email format"),
        body("username").isString().withMessage("Username must be a string"),
        body("password").isLength({min: 4 , max: 12}).withMessage("Password must be at least 4 characters long"),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) { return next() }
            res.status(400).json({ 
                errors: errors.array() 
            });
        }
    ] 