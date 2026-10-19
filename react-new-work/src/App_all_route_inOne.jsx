import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

const API_URL = "http://localhost:3000/employees";

const initialForm = {
  name: "",
  email: "",
  password: "",
  gender: "",
  skills: [],
  country: "",
  experience: "",
  agree: false,
};

// Shared form for Add and Update routes
function EmployeeForm({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // READ ONE: Fetch employee for the edit route
  useEffect(() => {
    if (!isEdit) return;

    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Employee not found");
        }

        const employee = await response.json();

        setForm({
          ...initialForm,
          ...employee,
          // Never populate a stored password into the form
          password: "",
          skills: employee.skills || [],
        });
      } catch (error) {
        setMessage(error.message);
      }
    };

    fetchEmployee();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "skills") {
      setForm((prev) => ({
        ...prev,
        skills: checked
          ? [...prev.skills, value]
          : prev.skills.filter((skill) => skill !== value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!isEdit && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.gender) {
      newErrors.gender = "Select your gender";
    }

    if (form.skills.length === 0) {
      newErrors.skills = "Select at least one skill";
    }

    if (!form.country) {
      newErrors.country = "Select a country";
    }

    if (!form.experience) {
      newErrors.experience = "Select your experience";
    }

    if (!form.agree) {
      newErrors.agree = "Please accept the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CREATE: POST
  // UPDATE: PATCH
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setMessage("");

    try {
      const payload = { ...form };

      // Keep existing password if the edit field is blank
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      const response = await fetch(isEdit ? `${API_URL}/${id}` : API_URL, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to save employee");
      }

      await response.json();

      navigate("/employees", {
        state: {
          message: isEdit
            ? "Employee updated successfully!"
            : "Employee added successfully!",
        },
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isEdit ? "Update Employee" : "Add New Employee"}</h2>

      {message && <p role="alert">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
          <p>{errors.name}</p>
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          <p>{errors.email}</p>
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={
              isEdit
                ? "Leave blank to keep existing password"
                : "Enter password"
            }
          />
          <p>{errors.password}</p>
        </div>

        <div>
          <label>Gender</label>
          {["Male", "Female", "Other"].map((g) => (
            <label key={g}>
              <input
                type="radio"
                name="gender"
                value={g}
                checked={form.gender === g}
                onChange={handleChange}
              />
              {g}
            </label>
          ))}
          <p>{errors.gender}</p>
        </div>

        <div>
          <label>Skills</label>
          {["React", "Angular", "Python"].map((skill) => (
            <label key={skill}>
              <input
                type="checkbox"
                name="skills"
                value={skill}
                checked={form.skills.includes(skill)}
                onChange={handleChange}
              />
              {skill}
            </label>
          ))}
          <p>{errors.skills}</p>
        </div>

        <div>
          <label>Country</label>
          <select name="country" value={form.country} onChange={handleChange}>
            <option value="">Select country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
          <p>{errors.country}</p>
        </div>

        <div>
          <label>Experience</label>
          <select
            name="experience"
            value={form.experience}
            onChange={handleChange}
          >
            <option value="">Select experience</option>
            <option value="Fresher">Fresher</option>
            <option value="1-3 years">1-3 years</option>
            <option value="3+ years">3+ years</option>
          </select>
          <p>{errors.experience}</p>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            I accept the terms and conditions
          </label>
          <p>{errors.agree}</p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Employee" : "Add Employee"}
        </button>

        <Link to="/employees"> Cancel </Link>
      </form>
    </div>
  );
}

// HOME: Primary route
function Home() {
  return (
    <div>
      <h2>Employee Management System</h2>
      <p>Choose an operation:</p>

      <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/employees">Employee List</Link>
        <Link to="/employees/add">Add Employee</Link>
      </nav>
    </div>
  );
}

// READ: Display all employees
function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch a success message passed from Add/Update
  const navigate = useNavigate();

  useEffect(() => {
    const stateMessage = window.history.state?.usr?.message;

    if (stateMessage) {
      setMessage(stateMessage);
      navigate(window.location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load employees");
        }

        setEmployees(await response.json());
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;

  return (
    <div>
      <h2>Employee List ({employees.length})</h2>

      {message && <p role="status">{message}</p>}

      <Link to="/employees/add">Add New Employee</Link>

      {employees.length === 0 && <p>No employees found.</p>}

      {employees.map((employee) => (
        <div
          key={employee.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            margin: "12px 0",
          }}
        >
          <p>
            <strong>ID:</strong> {employee.id}
          </p>
          <p>
            <strong>Name:</strong> {employee.name}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Gender:</strong> {employee.gender}
          </p>
          <p>
            <strong>Skills:</strong> {employee.skills?.join(", ")}
          </p>
          <p>
            <strong>Country:</strong> {employee.country}
          </p>
          <p>
            <strong>Experience:</strong> {employee.experience}
          </p>

          <Link to={`/employees/edit/${employee.id}`}>Edit</Link>

          {" | "}

          <Link to={`/employees/delete/${employee.id}`}>Delete</Link>
        </div>
      ))}
    </div>
  );
}

// DELETE: Confirmation page for a specific employee
function DeleteEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Employee not found");
        }

        setEmployee(await response.json());
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const confirmDelete = async () => {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete employee");
      }

      navigate("/employees", {
        state: { message: "Employee deleted successfully!" },
      });
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Delete Employee</h2>

      {message && <p role="alert">{message}</p>}

      {employee && (
        <>
          <p>
            Are you sure you want to delete <strong>{employee.name}</strong>?
          </p>

          <button onClick={confirmDelete} disabled={loading}>
            Confirm Delete
          </button>

          <Link to="/employees">Cancel</Link>
        </>
      )}
    </div>
  );
}

// Application routes
export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 800, margin: "30px auto", padding: 16 }}>
        <nav style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <Link to="/">Home</Link>
          <Link to="/employees">Employee List</Link>
          <Link to="/employees/add">Add Employee</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<EmployeeForm />} />
          <Route path="/employees/edit/:id" element={<EmployeeForm isEdit />} />
          <Route path="/employees/delete/:id" element={<DeleteEmployee />} />
          <Route
            path="*"
            element={
              <div>
                <h2>404 - Page Not Found</h2>
                <Link to="/">Go Home</Link>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
