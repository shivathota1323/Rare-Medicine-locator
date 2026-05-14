import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance.js";

const initialForm = (user) => ({
  medicineName: "",
  genericName: "",
  category: "",
  strength: "",
  form: "Tablet",
  rarity: "Rare",
  description: "",
  prescriptionRequired: true,
  quantity: 1,
  price: 0,
  expiryDate: "",
  pharmacyName: user?.name || "",
  contact: user?.phone || "",
  city: user?.city || "",
  address: user?.address || "",
  notes: "",
  isAvailable: true
});

function MedicineForm({ currentUser, onSaved }) {
  const [form, setForm] = useState(initialForm(currentUser));
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.post("/medicine-api", form);
      toast.success("Medicine added to inventory");
      setForm(initialForm(currentUser));
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to add medicine");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Medicine name
          <input name="medicineName" value={form.medicineName} onChange={handleChange} required />
        </label>
        <label>
          Generic name
          <input name="genericName" value={form.genericName} onChange={handleChange} />
        </label>
        <label>
          Category
          <input name="category" value={form.category} onChange={handleChange} />
        </label>
        <label>
          Strength
          <input name="strength" value={form.strength} onChange={handleChange} placeholder="Ex: 50mg" />
        </label>
        <label>
          Form
          <select name="form" value={form.form} onChange={handleChange}>
            <option>Tablet</option>
            <option>Capsule</option>
            <option>Injection</option>
            <option>Syrup</option>
            <option>Drops</option>
            <option>Cream</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Rarity
          <select name="rarity" value={form.rarity} onChange={handleChange}>
            <option>Rare</option>
            <option>Critical</option>
            <option>Imported</option>
            <option>Limited stock</option>
            <option>Orphan drug</option>
          </select>
        </label>
        <label>
          Quantity
          <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} />
        </label>
        <label>
          Price
          <input name="price" type="number" min="0" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Expiry date
          <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
        </label>
        <label>
          Contact
          <input name="contact" value={form.contact} onChange={handleChange} required />
        </label>
        <label>
          City
          <input name="city" value={form.city} onChange={handleChange} required />
        </label>
        <label>
          Pharmacy name
          <input name="pharmacyName" value={form.pharmacyName} onChange={handleChange} required />
        </label>
      </div>
      <label>
        Address
        <textarea name="address" value={form.address} onChange={handleChange} required />
      </label>
      <label>
        Notes
        <textarea name="notes" value={form.notes} onChange={handleChange} />
      </label>
      <label className="checkbox-row">
        <input name="prescriptionRequired" type="checkbox" checked={form.prescriptionRequired} onChange={handleChange} />
        Prescription required
      </label>
      <button className="primary-button" disabled={saving}>
        {saving ? "Saving..." : "Add medicine"}
      </button>
    </form>
  );
}

export default MedicineForm;
