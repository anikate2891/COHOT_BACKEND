import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";

async function tokenResposnse(user, res) {
    const token = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

export const register = async (req, res) => {
    const { email, contract, password, fullname, role } = req.body;
	try {
		const existingUser = await userModel.findOne({
			$or: [  { email },{ contract }    ]
		});
		if (existingUser) {
			return res.status(409).json({ message: "User already exists with this email." });
		}

		const user = await userModel.create({
			email,
			contract,
			password:
			fullname,
			role,
		});

		const token = jwt.sign(
			{ id: user._id, email: user.email, role: user.role },
			config.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: config.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(201).json({
			message: "User registered successfully.",
			user: {
				id: user._id,
				email: user.email,
				fullname: user.fullname,
				role: user.role,
				contract: user.contract,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: "Registration failed.", error: error.message });
	}
}

export const login = async (req, res) => {} 