import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        let token;

        // Check if the token exists in the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // jwt.verify() does not return false if valid
        // Attach the user object to the request
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default isAuthenticated;
