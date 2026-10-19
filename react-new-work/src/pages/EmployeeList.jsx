import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/employees";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // GET: fetch all employees.
  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load employees.");
        }

        setEmployees(await response.json());
      } catch (err) {
        setError(err.message);
      }
    }

    loadEmployees();
  }, []);

  // Display messages returned by Add/Edit/Delete pages.
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location.key, location.pathname, location.state, navigate]);

  return (
    <div>
      <h2>Employee List</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Link to="/employees/add">Add New Employee</Link>

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Skills</th>
              <th>Country</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.gender}</td>
                <td>{employee.skills?.join(", ")}</td>
                <td>{employee.country}</td>
                <td>{employee.experience}</td>
                <td>
                  <Link to={`/employees/edit/${employee.id}`}>Edit</Link>
                  {" | "}
                  <Link to={`/employees/delete/${employee.id}`}>Delete</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeList;
