import express from "express";
import isAuthenticated from "../middlewares/isAuthenticared.js";
import { addAvailability, getAvailability,viewBookings,cancelAppointment, deleteAppointment} from "../controllers/professor.controller.js";
const router=express.Router();

router.route("/availability").post(isAuthenticated,addAvailability);

export default router;
