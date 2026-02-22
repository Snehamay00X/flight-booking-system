import { app } from "./app";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/connectDB";

// app.listen(process.env.PORT || 3000, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error", error);
        process.exit(1);
    });
