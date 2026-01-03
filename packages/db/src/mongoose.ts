import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(uri: string) {
  if (!uri) throw new Error("MONGO_URL is required");
  if (isConnected) return;

  await mongoose.connect(uri);
  isConnected = true;
}



export { mongoose };
