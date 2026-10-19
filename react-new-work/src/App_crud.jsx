import React, { useEffect, useState } from "react";

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

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // READ: GET all employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Fetch employees when the component first loads
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle input, radio, select and checkbox fields
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

  // Validate form fields
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    // Password is required when creating an employee.
    // During editing, it can be left blank to keep the old value.
    if (!editingId && form.password.length < 6) {
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
    setMessage("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const isEditing = editingId !== null;

      // Do not overwrite an existing password with a blank value
      const payload = { ...form };

      if (isEditing && !payload.password) {
        delete payload.password;
      }

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Unable to save employee");
      }

      const savedEmployee = await response.json();

      if (isEditing) {
        // Update the employee in the local list
        setEmployees((prev) =>
          prev.map((employee) =>
            employee.id === editingId ? savedEmployee : employee,
          ),
        );

        setMessage("Employee updated successfully!");
      } else {
        // Add the newly created employee to the local list
        setEmployees((prev) => [...prev, savedEmployee]);
        setMessage("Employee added successfully!");
      }

      resetForm();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load employee details into the form
  const handleEdit = (employee) => {
    setForm({
      ...initialForm,
      ...employee,
      // Do not populate a stored password into the form
      password: "",
      skills: employee.skills || [],
    });

    setEditingId(employee.id);
    setErrors({});
    setMessage("");
  };

  // DELETE: DELETE /employees/:id
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete employee");
      }

      setEmployees((prev) => prev.filter((employee) => employee.id !== id));

      if (editingId === id) {
        resetForm();
      }

      setMessage("Employee deleted successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Reset form and exit edit mode
  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", padding: 16 }}>
      <h2>Employee Registration</h2>

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
              editingId
                ? "Leave blank to keep existing password"
                : "Enter password"
            }
          />
          <p>{errors.password}</p>
        </div>

        <div>
          <label>Gender</label>
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} style={{ marginLeft: 10 }}>
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
            <label key={skill} style={{ marginLeft: 10 }}>
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
          {loading
            ? "Saving..."
            : editingId !== null
              ? "Update Employee"
              : "Add Employee"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      {message && <p role="status">{message}</p>}

      <hr />

      <h2>Employee List ({employees.length})</h2>

      {employees.map((employee) => (
        <div
          key={employee.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6,
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
          <p>
            <strong>Accepted terms:</strong> {employee.agree ? "Yes" : "No"}
          </p>

          <button type="button" onClick={() => handleEdit(employee)}>
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDelete(employee.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
