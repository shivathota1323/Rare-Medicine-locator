import { Schema, model } from "mongoose";

const medicineSchema = new Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true
    },
    genericName: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    strength: {
      type: String,
      trim: true
    },
    form: {
      type: String,
      enum: ["Tablet", "Capsule", "Injection", "Syrup", "Drops", "Cream", "Other"],
      default: "Tablet"
    },
    rarity: {
      type: String,
      enum: ["Rare", "Critical", "Imported", "Limited stock", "Orphan drug"],
      default: "Rare"
    },
    description: {
      type: String,
      trim: true
    },
    prescriptionRequired: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      min: 0,
      default: 1
    },
    price: {
      type: Number,
      min: 0,
      default: 0
    },
    expiryDate: {
      type: Date
    },
    pharmacy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    pharmacyName: {
      type: String,
      required: true,
      trim: true
    },
    contact: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    notes: {
      type: String,
      trim: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

medicineSchema.index({
  medicineName: "text",
  genericName: "text",
  category: "text",
  city: "text",
  pharmacyName: "text"
});

export const MedicineModel = model("Medicine", medicineSchema);
