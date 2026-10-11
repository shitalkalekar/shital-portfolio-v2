import bcrypt from "bcrypt";
import User from "../models/User.js";
import connectDB from "../db/database.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

   const existingAdmin = await User.findOne({
  email: process.env.ADMIN_EMAIL,
});

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
  process.env.ADMIN_PASSWORD,
  10
);

    const admin = await User.create({
      name: "Shital Rohidas Kalekar",
      email: "admin@shitalportfolio.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully");
    console.log("Admin ID:", admin._id);

    process.exit(0);
  } catch (error) {
    console.error("Create admin error:", error);
    process.exit(1);
  }
};

createAdmin();