import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import app from "./src/app.js";

// Connect to MongoDB on cold start (cached across warm invocations)
connectDB();

export default app;
