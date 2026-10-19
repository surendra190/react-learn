import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

function EmployeeForm({ isEdit = false }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);

  const navigate = useNavigate();
  const { id } = useParams();

  // In Edit mode, load the existing employee.
  useEffect(() => {
    if (!isEdit) return;

    async function loadEmployee() {
      try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Employee not found");
        }

        const employee = await response.json();

        setForm({
          ...initialForm,
          ...employee,
          password: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id, isEdit]);

  // Handle text fields, radio buttons and the agreement checkbox.
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Handle multiple skill checkboxes.
  function handleSkillChange(event) {
    const { value, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      skills: checked
        ? [...previous.skills, value]
        : previous.skills.filter((skill) => skill !== value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.gender ||
      form.skills.length === 0 ||
      !form.country ||
      form.experience === "" ||
      !form.agree
    ) {
      setError("Please complete all required fields.");
      return;
    }

    // Password is required when adding a new employee.
    if (!isEdit && form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      const payload = { ...form };

      // If editing and password is blank, keep the old value.
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
        throw new Error("Unable to save employee.");
      }

      navigate("/employees", {
        state: {
          message: isEdit
            ? "Employee updated successfully."
            : "Employee added successfully.",
        },
      });
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading employee...</p>;

  return (
    <div>
      <h2>{isEdit ? "Update Employee" : "Add Employee"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={isEdit ? "Leave blank to keep current password" : ""}
            required={!isEdit}
            minLength={6}
          />
        </div>

        <fieldset>
          <legend>Gender</legend>

          {["Male", "Female", "Other"].map((gender) => (
            <label key={gender}>
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={form.gender === gender}
                onChange={handleChange}
                required
              />
              {gender}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Skills</legend>

          {["React", "Angular", "Python", "Java"].map((skill) => (
            <label key={skill}>
              <input
                type="checkbox"
                checked={form.skills.includes(skill)}
                onChange={handleSkillChange}
                value={skill}
              />
              {skill}
            </label>
          ))}
        </fieldset>

        <div>
          <label>Country: </label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          >
            <option value="">Select country</option>
            <option value="India">India</option>
            <option value="UK">UK</option>
            <option value="USA">USA</option>
          </select>
        </div>

        <div>
          <label>Experience (years): </label>
          <input
            type="number"
            name="experience"
            min="0"
            value={form.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              required
            />
            I agree to the terms
          </label>
        </div>

        <button type="submit">
          {isEdit ? "Update Employee" : "Add Employee"}
        </button>

        <button type="button" onClick={() => navigate("/employees")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
