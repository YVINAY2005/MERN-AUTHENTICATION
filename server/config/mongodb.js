// mongodb.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB at:", process.env.MONGODB_URI);

    mongoose.connection.on("connected", () =>
      console.log("Database connected successfully")
    );
    mongoose.connection.on("error", (err) =>
      console.error("MongoDB connection error:", err)
    );

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "mern-auth",
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
