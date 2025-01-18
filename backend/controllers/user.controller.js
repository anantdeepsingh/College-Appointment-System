import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const u = await User.findOne({ email });

        if (u) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }


        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        })
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
}

export const login = async (req, res) => {
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
            res.status(401); 
            throw new Error(`You are not authorized to log in as a ${role}`);
        }
    
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            })
        }
        else{
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
}


