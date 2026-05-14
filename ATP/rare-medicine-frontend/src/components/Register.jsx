import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../store/authStore.js";

function Register() {
  const navigate = useNavigate();
  const register = useAuth((state) => state.register);
  const loading = useAuth((state) => state.loading);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    phone: "",
    city: "",
    address: ""
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      toast.success("Account created. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <p className="eyebrow">Join the locator network</p>
        <h1>Create account</h1>
        <div className="form-grid">
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="USER">Patient/User</option>
              <option value="PHARMACY">Pharmacy</option>
            </select>
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            City
            <input name="city" value={form.city} onChange={handleChange} required />
          </label>
        </div>
        <label>
          Address
          <textarea name="address" value={form.address} onChange={handleChange} />
        </label>
        <button className="primary-button" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="muted">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
