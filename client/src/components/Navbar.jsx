import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Alzikrayat</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
                <Link to="/gallery">Gallery</Link>
        {user ? (
          <>
            <span className="nav-user">Hi, {user.firstName}</span>
            <button type="button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login / Register</Link>
        )}
      </div>
    </nav>
  );
}