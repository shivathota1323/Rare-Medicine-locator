import exp from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authApp = exp.Router();

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000
});

const publicUser = (userDocument) => {
  const user = userDocument.toObject();
  delete user.password;
  return user;
};

authApp.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role, phone, city, address } = req.body;
    const allowedRoles = ["USER", "PHARMACY"];

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const selectedRole = role?.toUpperCase() || "USER";
    if (!allowedRoles.includes(selectedRole)) {
      return res.status(400).json({ message: "Only USER and PHARMACY registration is allowed" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: selectedRole,
      phone,
      city,
      address
    });

    res.status(201).json({ message: "Account created successfully", payload: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

authApp.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, cookieOptions());
    res.status(200).json({
      message: "Login successful",
      token,
      payload: publicUser(user)
    });
  } catch (err) {
    next(err);
  }
});

authApp.get("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.status(200).json({ message: "Logout successful" });
});

authApp.get("/check-auth", verifyToken("USER", "PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Authorized", payload: publicUser(user) });
  } catch (err) {
    next(err);
  }
});
