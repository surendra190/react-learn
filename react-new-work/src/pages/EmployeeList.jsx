import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEmployees } from "../context/EmployeeContext";

function EmployeeList() {
  const { employees, loading, error } = useEmployees();
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location.key, location.pathname, location.state, navigate]);

  if (loading) return <p>Loading employees...</p>;

  return (
    <section>
      <div className="page-heading">
        <h2>Employee List</h2>
        <Link className="button-link" to="/employees/add">
          + Add Employee
        </Link>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
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
                    <div className="action-links">
                      <Link to={`/employees/edit/${employee.id}`}>Edit</Link>
                      <Link to={`/employees/delete/${employee.id}`}>
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default EmployeeList;
