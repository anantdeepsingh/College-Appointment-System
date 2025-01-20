import express from "express";
import isAuthenticated from "../middlewares/isAuthenticared.js";
import { addAvailability, getAvailability,viewBookings,cancelAppointment, deleteAppointment} from "../controllers/professor.controller.js";
const router=express.Router();

router.route("/availability").post(isAuthenticated,addAvailability);
router.route("/scheduleavailable").get(isAuthenticated,getAvailability);
router.route("/bookings").get(isAuthenticated,viewBookings);
router.route("/bookings/:appointmentId/cancel").put(isAuthenticated,cancelAppointment);
router.route("/availability/:slotId").delete(isAuthenticated,deleteAppointment);
export default router;
