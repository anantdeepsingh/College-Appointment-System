import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        const user = await User.create({ name, email, password, role });
        const token = generateToken(user._id);

        console.log("Generated Token:", token); // Log token to see if it's created

        res.status(201).json({
            message: "You have been successfully registered",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token, // Send token in the response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        let user = await User.findOne({ email });

        if (user && user.role !== role) {
            return res.status(401).json({
                message: `You are not authorized to log in as a ${role}`
            });
        }

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            console.log("Generated Token:", token); 

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token, 
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
};
