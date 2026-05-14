import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClipboardList, PackagePlus } from "lucide-react";
import api from "../api/axiosInstance.js";
import { useAuth } from "../store/authStore.js";
import MedicineForm from "./MedicineForm.jsx";
import RequestsPanel from "./RequestsPanel.jsx";

function Dashboard() {
  const { currentUser } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const isPharmacy = currentUser?.role === "PHARMACY" || currentUser?.role === "ADMIN";

  const loadInventory = async () => {
    if (!isPharmacy) return;

    try {
      const res = await api.get("/medicine-api/mine");
      setInventory(res.data.payload);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load inventory");
    }
  };

  useEffect(() => {
    loadInventory();
  }, [refreshKey, currentUser?.role]);

  const handleSaved = () => {
    setRefreshKey((value) => value + 1);
  };

  const toggleAvailability = async (medicine) => {
    try {
      await api.put(`/medicine-api/${medicine._id}`, { isAvailable: !medicine.isAvailable });
      toast.success("Availability updated");
      handleSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{currentUser?.role === "PHARMACY" ? "Pharmacy workspace" : "Your medicine requests"}</h1>
        </div>
        <div className="profile-box">
          <strong>{currentUser?.name}</strong>
          <span>{currentUser?.email}</span>
          <span>{currentUser?.city}</span>
        </div>
      </div>

      {isPharmacy ? (
        <div className="dashboard-grid">
          <section className="tool-surface">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Add stock</p>
                <h2>
                  <PackagePlus size={22} />
                  Inventory form
                </h2>
              </div>
            </div>
            <MedicineForm currentUser={currentUser} onSaved={handleSaved} />
          </section>

          <section className="tool-surface">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your stock</p>
                <h2>Inventory list</h2>
              </div>
            </div>
            <div className="inventory-list">
              {inventory.map((medicine) => (
                <article className="inventory-item" key={medicine._id}>
                  <div>
                    <strong>{medicine.medicineName}</strong>
                    <span>{medicine.city} | Qty {medicine.quantity} | Rs {medicine.price || 0}</span>
                  </div>
                  <button className="secondary-button" onClick={() => toggleAvailability(medicine)}>
                    {medicine.isAvailable ? "Mark unavailable" : "Mark available"}
                  </button>
                </article>
              ))}
              {inventory.length === 0 ? <div className="empty-state">No medicines added yet.</div> : null}
            </div>
          </section>
        </div>
      ) : null}

      <section className="tool-surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Requests</p>
            <h2>
              <ClipboardList size={22} />
              {isPharmacy ? "Patient requests" : "My requests"}
            </h2>
          </div>
        </div>
        <RequestsPanel isPharmacy={isPharmacy} />
      </section>
    </section>
  );
}

export default Dashboard;
