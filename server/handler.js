import connectDB from "./src/config/db.js";
import app from "./src/app.js";

let isConnected = false;

// Serverless handler: lazily connects to MongoDB then delegates to Express
export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}
