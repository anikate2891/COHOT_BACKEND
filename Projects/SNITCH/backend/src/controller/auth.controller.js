import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign( { id: user._id }, config.JWT_SECRET,{ expiresIn: "7d" }	);

	res.cookie("token", token, {
		httpOnly: true,
		secure: config.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.status(200).json({
		message,
		success: true,
		user: {
			id: user._id,
			email: user.email,
			fullname: user.fullname,
			role: user.role,
			contact: user.contact,
		},
	});
}

export const registerController = async (req, res) => {
		const { email, contact, password, fullname, isseller } = req.body;
		try {
			const existingUser = await userModel.findOne({
				$or: [  { email },{ contact }    ]
			});
			if (existingUser) {
				return res.status(409).json({ message: "User already exists with this email." });
			}

			const user = await userModel.create({
				email,
				contact,
				password,
				fullname,
				role: isseller ? "seller" : "buyer",	
			});

			await sendTokenResponse(user, res, "User registered successfully.");

			return res.status(201).json({
				message: "User registered successfully.",
				user: {
					id: user._id,
					email: user.email,
					fullname: user.fullname,
					role: user.role,
					contact: user.contact,
				},
			});
		} catch (error) {
			return res.status(500).json({ message: "Registration failed.", error: error.message });
		}
}

export const loginController = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials." });
		}
		await sendTokenResponse(user, res, "Login successful.");
	} catch (error) {
		return res.status(500).json({ message: "Login failed.", error: error.message });
	}

} 

export const getMeController = async (req, res, next) => {
	try {
		const user = await userModel.findById(req.user.id).select('-password');
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}
		return res.status(200).json({message: "User details fetched successfully.", user });
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch user details.", error: error.message });
	}
}

export const googleCallbackController = async (req, res) => {
	const { id, emails, displayName, photos } = req.user
	const email = emails[0].value;
	const profilePic = photos[0].value;

	try {
		let user = await userModel.findOne({ email });
		if (!user) {
			user = await userModel.create({
				email,
				fullname: displayName,
				googleId: id,
			})
			const token = jwt.sign( 
				{ id: user._id }, 
				config.JWT_SECRET,
				{ expiresIn: "7d" }	);
			res.cookie("token",token);
		}	
		return res.redirect('http://localhost:5173');
	} catch (error) {
		return res.status(500).json({ message: "Google authentication failed.", error: error.message });
	}
}