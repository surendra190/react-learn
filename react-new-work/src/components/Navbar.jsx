import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "20px", padding: "15px" }}>
      <Link to="/">Home</Link>
      <Link to="/employees">Employee List</Link>
      <Link to="/employees/add">Add Employee</Link>
    </nav>
  );
}

export default Navbar;
