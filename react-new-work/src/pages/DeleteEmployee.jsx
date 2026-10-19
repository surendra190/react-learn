import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";

function DeleteEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getEmployeeById, deleteEmployee } = useEmployees();

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadEmployee() {
      try {
        const data = await getEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id, getEmployeeById]);

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      await deleteEmployee(id);

      navigate("/employees", {
        state: { message: "Employee deleted successfully." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p>Loading employee...</p>;

  if (!employee) {
    return (
      <section>
        <p className="error-message">{error || "Employee not found."}</p>
        <Link to="/employees">Back to employee list</Link>
      </section>
    );
  }

  return (
    <section className="form-card">
      <h2>Delete Employee</h2>

      <p>
        Are you sure you want to delete <strong>{employee.name}</strong>?
      </p>
      <p>Email: {employee.email}</p>

      {error && <p className="error-message">{error}</p>}

      <div className="button-row">
        <button
          className="danger-button"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Confirm Delete"}
        </button>

        <Link className="button-link secondary-link" to="/employees">
          Cancel
        </Link>
      </div>
    </section>
  );
}

export default DeleteEmployee;
