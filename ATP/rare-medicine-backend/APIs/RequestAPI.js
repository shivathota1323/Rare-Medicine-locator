import exp from "express";
import { RequestModel } from "../models/RequestModel.js";
import { MedicineModel } from "../models/MedicineModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const requestApp = exp.Router();

requestApp.post("/", verifyToken("USER", "PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const request = await RequestModel.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({ message: "Medicine request submitted", payload: request });
  } catch (err) {
    next(err);
  }
});

requestApp.get("/mine", verifyToken("USER", "PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const requests = await RequestModel.find({ user: req.user.id })
      .populate("matchedMedicine")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Requests fetched successfully", payload: requests });
  } catch (err) {
    next(err);
  }
});

requestApp.get("/", verifyToken("PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const requests = await RequestModel.find()
      .populate("user", "name email phone city")
      .populate("matchedMedicine")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "All requests fetched successfully", payload: requests });
  } catch (err) {
    next(err);
  }
});

requestApp.put("/:id", verifyToken("PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const request = await RequestModel.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (req.body.matchedMedicine) {
      const medicine = await MedicineModel.findById(req.body.matchedMedicine);
      if (!medicine) {
        return res.status(404).json({ message: "Matched medicine not found" });
      }
    }

    Object.assign(request, req.body);
    await request.save();

    res.status(200).json({ message: "Request updated successfully", payload: request });
  } catch (err) {
    next(err);
  }
});
