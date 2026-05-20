import { Schema, model } from "mongoose";

const requestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    medicineName: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    quantityNeeded: {
      type: Number,
      min: 1,
      default: 1
    },
    urgency: {
      type: String,
      enum: ["Normal", "Urgent", "Emergency"],
      default: "Normal"
    },
    prescriptionAvailable: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["Open", "Contacted", "Found", "Closed"],
      default: "Open"
    },
    matchedMedicine: {
      type: Schema.Types.ObjectId,
      ref: "Medicine"
    }
  },
  { timestamps: true }
);

export const RequestModel = model("MedicineRequest", requestSchema);
