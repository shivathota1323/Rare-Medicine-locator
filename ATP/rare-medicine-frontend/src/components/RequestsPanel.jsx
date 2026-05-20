import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance.js";

function RequestsPanel({ isPharmacy }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const endpoint = isPharmacy ? "/request-api" : "/request-api/mine";
      const res = await api.get(endpoint);
      setRequests(res.data.payload);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [isPharmacy]);

  const updateStatus = async (requestId, status) => {
    try {
      await api.put(`/request-api/${requestId}`, { status });
      toast.success("Request status updated");
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update request");
    }
  };

  if (loading) {
    return <div className="page-state">Loading requests...</div>;
  }

  return (
    <div className="request-list">
      {requests.map((request) => (
        <article className="request-item" key={request._id}>
          <div>
            <div className="card-top">
              <span>{request.urgency}</span>
              <strong>{request.status}</strong>
            </div>
            <h3>{request.medicineName}</h3>
            <p>
              {request.patientName} needs {request.quantityNeeded} in {request.city}
            </p>
            {request.user ? (
              <p className="muted">
                Contact: {request.user.name} | {request.user.email} | {request.user.phone || "No phone"}
              </p>
            ) : null}
            {request.message ? <p className="muted">{request.message}</p> : null}
          </div>
          {isPharmacy ? (
            <div className="status-actions">
              <button className="secondary-button" onClick={() => updateStatus(request._id, "Contacted")}>
                Contacted
              </button>
              <button className="secondary-button" onClick={() => updateStatus(request._id, "Found")}>
                Found
              </button>
              <button className="secondary-button" onClick={() => updateStatus(request._id, "Closed")}>
                Closed
              </button>
            </div>
          ) : null}
        </article>
      ))}
      {requests.length === 0 ? <div className="empty-state">No requests yet.</div> : null}
    </div>
  );
}

export default RequestsPanel;
