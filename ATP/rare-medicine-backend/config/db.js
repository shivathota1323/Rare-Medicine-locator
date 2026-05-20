import { connect } from "mongoose";

export const connectDB = async () => {
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is missing in environment variables");
  }

  await connect(process.env.DB_URL);
  console.log("MongoDB connected");
};
