import { Router } from "express";
import { searchedFlights, getFilters, selectFlight } from "../controllers/flight.controller";

const router = Router();

// router.post("/", (req, res) => {
//     res.send("Flight created");
// })
router.get("/filters", getFilters)
router.post("/search", searchedFlights)
router.post("/select", selectFlight)



export default router;