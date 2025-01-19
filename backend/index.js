import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import professorRoute from "./routes/professor.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.use("/api/auth", userRoute);
app.use("/api/professors", professorRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
