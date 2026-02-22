import { Router } from "express";
import { bookingTickets } from "../controllers/booking.controller";

const router = Router();

router.route("/").post(bookingTickets)

export default router;
