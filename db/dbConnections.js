import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const dbUsername = process.env.DB_USERNAME || "";
const dbPassword = process.env.DB_PASSWORD || "";
const cluster = process.env.DB_CLUSTER || "";
const dbName = process.env.DB_NAME || "";

const dbCloud = `mongodb+srv://${dbUsername}:${dbPassword}@${cluster}/${dbName}?retryWrites=true&w=majority`;

const local = "mongodb://localhost:27017/Notes-App";

export const connectToDB = async () => {   
  try {
    const connect = await mongoose.connect(dbCloud);
    if (connect) {
      console.log("DB connected successfully");
    } else {
      console.log("DB not found");
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
