import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Employee Management System</h1>

      <p>Manage employee records using the options below.</p>

      <Link to="/employees">View Employees</Link>
      {" | "}
      <Link to="/employees/add">Register Employee</Link>
    </div>
  );
}

export default Home;
