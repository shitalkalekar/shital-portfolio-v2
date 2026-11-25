import mongoose from "mongoose";
import dns from "dns";

// Fallback public DNS servers for local networks that block MongoDB SRV lookups
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
  console.warn("Could not override DNS servers:", error.message);
}

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MongoDB connection failed: MONGODB_URI environment variable is not set.");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(mongoUri);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;