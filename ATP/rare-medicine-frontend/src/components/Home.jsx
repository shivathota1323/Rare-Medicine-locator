import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Phone, Search, ShieldCheck, Siren, Store } from "lucide-react";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";

const emptyRequest = {
  patientName: "",
  medicineName: "",
  city: "",
  quantityNeeded: 1,
  urgency: "Normal",
  prescriptionAvailable: false,
  message: ""
};

function Home() {
  const { isAuthenticated } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", city: "", rarity: "" });
  const [requestForm, setRequestForm] = useState(emptyRequest);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("available", "true");
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/medicine-api?${queryString}`);
      setMedicines(res.data.payload);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [queryString]);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleRequestChange = (event) => {
    const { name, value, type, checked } = event.target;
    setRequestForm({ ...requestForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login before submitting a medicine request");
      return;
    }

    try {
      await api.post("/request-api", requestForm);
      toast.success("Request submitted successfully");
      setRequestForm(emptyRequest);
    } catch (err) {
      toast.error(err.response?.data?.message || "Request submission failed");
    }
  };

  return (
    <section className="home-page">
      <div className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">MERN stack locator</p>
          <h1>Find rare and urgent medicines faster.</h1>
          <p>
            Search verified pharmacy stock by medicine, generic name and city, then submit a request when a medicine is difficult to find.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#search-panel">
              Search medicine
            </a>
            <a className="secondary-button" href="#request-panel">
              Raise request
            </a>
          </div>
        </div>
        <div className="hero-panel">
          <div>
            <Siren size={34} />
            <strong>Emergency support</strong>
            <span>Prioritize urgent requests for quick pharmacy follow up.</span>
          </div>
          <div>
            <Store size={34} />
            <strong>Pharmacy inventory</strong>
            <span>Pharmacies can maintain medicine stock and availability.</span>
          </div>
          <div>
            <ShieldCheck size={34} />
            <strong>Prescription aware</strong>
            <span>Mark prescription requirement clearly for safer access.</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <section className="tool-surface" id="search-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live stock</p>
              <h2>Medicine search</h2>
            </div>
          </div>
          <div className="search-row">
            <label>
              Medicine or generic name
              <div className="input-icon">
                <Search size={18} />
                <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Ex: Riluzole" />
              </div>
            </label>
            <label>
              City
              <input name="city" value={filters.city} onChange={handleFilterChange} placeholder="Ex: Hyderabad" />
            </label>
            <label>
              Type
              <select name="rarity" value={filters.rarity} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Rare">Rare</option>
                <option value="Critical">Critical</option>
                <option value="Imported">Imported</option>
                <option value="Limited stock">Limited stock</option>
                <option value="Orphan drug">Orphan drug</option>
              </select>
            </label>
          </div>

          {loading ? <div className="page-state">Loading medicines...</div> : null}

          <div className="medicine-grid">
            {medicines.map((medicine) => (
              <article className="medicine-card" key={medicine._id}>
                <div className="card-top">
                  <span>{medicine.rarity}</span>
                  <strong>{medicine.isAvailable ? "Available" : "Unavailable"}</strong>
                </div>
                <h3>{medicine.medicineName}</h3>
                <p>{medicine.genericName || medicine.category || "Rare medicine stock"}</p>
                <div className="medicine-meta">
                  <span>{medicine.strength || medicine.form}</span>
                  <span>Qty {medicine.quantity}</span>
                  <span>Rs {medicine.price || 0}</span>
                </div>
                <div className="contact-lines">
                  <span>
                    <Store size={16} />
                    {medicine.pharmacyName}
                  </span>
                  <span>
                    <MapPin size={16} />
                    {medicine.city}, {medicine.address}
                  </span>
                  <span>
                    <Phone size={16} />
                    {medicine.contact}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {!loading && medicines.length === 0 ? (
            <div className="empty-state">No stock found. Submit a request and pharmacies can respond.</div>
          ) : null}
        </section>

        <section className="tool-surface request-box" id="request-panel">
          <p className="eyebrow">Need help</p>
          <h2>Submit medicine request</h2>
          <form onSubmit={handleRequestSubmit}>
            <label>
              Patient name
              <input name="patientName" value={requestForm.patientName} onChange={handleRequestChange} required />
            </label>
            <label>
              Medicine name
              <input name="medicineName" value={requestForm.medicineName} onChange={handleRequestChange} required />
            </label>
            <label>
              City
              <input name="city" value={requestForm.city} onChange={handleRequestChange} required />
            </label>
            <div className="form-grid">
              <label>
                Quantity
                <input name="quantityNeeded" type="number" min="1" value={requestForm.quantityNeeded} onChange={handleRequestChange} />
              </label>
              <label>
                Urgency
                <select name="urgency" value={requestForm.urgency} onChange={handleRequestChange}>
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Emergency</option>
                </select>
              </label>
            </div>
            <label className="checkbox-row">
              <input
                name="prescriptionAvailable"
                type="checkbox"
                checked={requestForm.prescriptionAvailable}
                onChange={handleRequestChange}
              />
              Prescription available
            </label>
            <label>
              Notes
              <textarea name="message" value={requestForm.message} onChange={handleRequestChange} placeholder="Dosage, urgency or alternate brand details" />
            </label>
            <button className="primary-button">Submit request</button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default Home;
