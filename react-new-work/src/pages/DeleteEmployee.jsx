import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000/employees";

function DeleteEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmployee() {
      try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Employee not found.");
        }

        setEmployee(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  async function handleDelete() {
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete employee.");
      }

      navigate("/employees", {
        state: { message: "Employee deleted successfully." },
      });
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading employee...</p>;

  if (error && !employee) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/employees">Back to employee list</Link>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div>
      <h2>Delete Employee</h2>

      <p>
        Are you sure you want to delete{" "}
        <strong>{employee.name}</strong>?
      </p>

      <p>Email: {employee.email}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleDelete}>Confirm Delete</button>

      <Link to="/employees" style={{ marginLeft: "12px" }}>
        Cancel
      </Link>
    </div>
  );
}

export default DeleteEmployee;