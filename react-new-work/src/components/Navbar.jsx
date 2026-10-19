import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Employee App
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/employees">Employee List</Link>
        <Link to="/employees/add">Add Employee</Link>

        <button type="button" onClick={toggleTheme} className="theme-button">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
