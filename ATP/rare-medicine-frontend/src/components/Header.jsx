import { Link, NavLink, useNavigate } from "react-router-dom";
import { Activity, LogOut, Search, UserRoundPlus } from "lucide-react";
import { useAuth } from "../store/authStore.js";

function Header() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <Activity size={24} />
        <span>RareMed Locator</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">
          <Search size={18} />
          Search
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button className="ghost-button" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">
              <UserRoundPlus size={18} />
              Register
            </NavLink>
          </>
        )}
      </nav>

      {currentUser ? (
        <div className="user-pill">
          <span>{currentUser.name}</span>
          <strong>{currentUser.role}</strong>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
