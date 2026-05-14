import exp from "express";
import { MedicineModel } from "../models/MedicineModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const medicineApp = exp.Router();

medicineApp.get("/", async (req, res, next) => {
  try {
    const { search = "", city = "", rarity = "", available = "true" } = req.query;
    const query = {};

    if (available !== "all") {
      query.isAvailable = available === "true";
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (rarity) {
      query.rarity = rarity;
    }

    if (search) {
      query.$or = [
        { medicineName: { $regex: search, $options: "i" } },
        { genericName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { pharmacyName: { $regex: search, $options: "i" } }
      ];
    }

    const medicines = await MedicineModel.find(query)
      .populate("pharmacy", "name email phone city address")
      .sort({ isAvailable: -1, updatedAt: -1 });

    res.status(200).json({ message: "Medicines fetched successfully", payload: medicines });
  } catch (err) {
    next(err);
  }
});

medicineApp.get("/mine", verifyToken("PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const query = req.user.role === "ADMIN" ? {} : { pharmacy: req.user.id };
    const medicines = await MedicineModel.find(query).sort({ updatedAt: -1 });
    res.status(200).json({ message: "Inventory fetched successfully", payload: medicines });
  } catch (err) {
    next(err);
  }
});

medicineApp.get("/:id", async (req, res, next) => {
  try {
    const medicine = await MedicineModel.findById(req.params.id).populate(
      "pharmacy",
      "name email phone city address"
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json({ message: "Medicine found", payload: medicine });
  } catch (err) {
    next(err);
  }
});

medicineApp.post("/", verifyToken("PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const data = req.body;
    const medicine = await MedicineModel.create({
      ...data,
      pharmacy: req.user.id,
      pharmacyName: data.pharmacyName || req.body.pharmacyName,
      contact: data.contact || req.body.contact
    });

    res.status(201).json({ message: "Medicine added successfully", payload: medicine });
  } catch (err) {
    next(err);
  }
});

medicineApp.put("/:id", verifyToken("PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const medicine = await MedicineModel.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (req.user.role !== "ADMIN" && medicine.pharmacy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can update only your own inventory" });
    }

    Object.assign(medicine, req.body);
    await medicine.save();

    res.status(200).json({ message: "Medicine updated successfully", payload: medicine });
  } catch (err) {
    next(err);
  }
});

medicineApp.delete("/:id", verifyToken("PHARMACY", "ADMIN"), async (req, res, next) => {
  try {
    const medicine = await MedicineModel.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (req.user.role !== "ADMIN" && medicine.pharmacy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can delete only your own inventory" });
    }

    await medicine.deleteOne();
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (err) {
    next(err);
  }
});
