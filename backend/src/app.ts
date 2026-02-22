import express from "express";
import cors from "cors";
import flightRouter from "./routes/flight.route";
import bookingRouter from "./routes/booking.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("Public"))


app.use("/api/flight", flightRouter);

app.use("/api/booking", bookingRouter);


export { app };