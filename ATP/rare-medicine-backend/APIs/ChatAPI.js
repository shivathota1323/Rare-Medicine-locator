import exp from "express";
import { MedicineModel } from "../models/MedicineModel.js";

export const chatApp = exp.Router();

chatApp.post("/", async (req, res, next) => {
  try {
    const message = String(req.body.message || "").trim();

    if (!message) {
      return res.status(400).json({ message: "Please type a message" });
    }

    const lowerMessage = message.toLowerCase();
    const searchWords = message
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .slice(0, 5);

    const medicineQuery = { isAvailable: true };
    if (searchWords.length) {
      medicineQuery.$or = searchWords.flatMap((word) => [
        { medicineName: { $regex: word, $options: "i" } },
        { genericName: { $regex: word, $options: "i" } },
        { city: { $regex: word, $options: "i" } }
      ]);
    }

    const medicines = searchWords.length ? await MedicineModel.find(medicineQuery).limit(3) : [];

    let reply = "I can help you search rare medicines, understand request status, and guide pharmacies to add stock.";

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      reply = "Hello! Tell me the medicine name and city, and I will help you find matching stock.";
    } else if (lowerMessage.includes("request")) {
      reply = "Open the request section, enter medicine name, city, urgency and prescription availability. Pharmacies can see and update your request.";
    } else if (lowerMessage.includes("pharmacy") || lowerMessage.includes("stock")) {
      reply = "Pharmacy users can add medicines from the inventory form, update quantity, price, expiry date and availability.";
    } else if (medicines.length) {
      reply = `I found ${medicines.length} possible match${medicines.length > 1 ? "es" : ""}: ${medicines
        .map((item) => `${item.medicineName} at ${item.pharmacyName}, ${item.city}`)
        .join("; ")}. Use the search filters for full details.`;
    } else if (lowerMessage.includes("emergency") || lowerMessage.includes("urgent")) {
      reply = "For urgent cases, submit a request with urgency marked Emergency and call the listed pharmacy directly when a match appears.";
    }

    res.status(200).json({ message: "Chat response generated", payload: { reply, medicines } });
  } catch (err) {
    next(err);
  }
});
