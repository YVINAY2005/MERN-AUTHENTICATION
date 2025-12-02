// mongodb.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to MongoDB at:", uri);

    // Basic validation to catch leftover placeholders like <db_password>
    if (!uri || uri.includes('<') || uri.includes('your_') || uri.includes('password')) {
      console.error('\n\n❌ MongoDB connection string looks invalid or contains placeholders.');
      console.error('Please set a proper `MONGODB_URI` in your `server/.env` (replace <db_password> with your DB password).');
      console.error('Example: mongodb+srv://username:myActualPassword@cluster0.iptuc06.mongodb.net/your-db-name\n\n');
      process.exit(1);
    }

    mongoose.connection.on("connected", () =>
      console.log("Database connected successfully")
    );
    mongoose.connection.on("error", (err) =>
      console.error("MongoDB connection error:", err)
    );

    await mongoose.connect(uri, {
      dbName: "mern-auth",
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
