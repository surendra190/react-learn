import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";

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
  const [saving, setSaving] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const { getEmployeeById, addEmployee, updateEmployee } = useEmployees();

  useEffect(() => {
    if (!isEdit) return;

    async function loadEmployee() {
      try {
        const employee = await getEmployeeById(id);

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
  }, [id, isEdit, getEmployeeById]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

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

    if (!isEdit && form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setSaving(true);

    try {
      const payload = { ...form };

      // Keep the existing password if the edit field is blank.
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      if (isEdit) {
        await updateEmployee(id, payload);
      } else {
        await addEmployee(payload);
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
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading employee...</p>;

  return (
    <section className="form-card">
      <h2>{isEdit ? "Update Employee" : "Add Employee"}</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="employee-form">
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={isEdit ? "Leave blank to keep current password" : ""}
            required={!isEdit}
            minLength={6}
          />
        </label>

        <fieldset>
          <legend>Gender</legend>
          {["Male", "Female", "Other"].map((gender) => (
            <label className="inline-option" key={gender}>
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
            <label className="inline-option" key={skill}>
              <input
                type="checkbox"
                value={skill}
                checked={form.skills.includes(skill)}
                onChange={handleSkillChange}
              />
              {skill}
            </label>
          ))}
        </fieldset>

        <label>
          Country
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
        </label>

        <label>
          Experience (years)
          <input
            type="number"
            name="experience"
            min="0"
            value={form.experience}
            onChange={handleChange}
            required
          />
        </label>

        <label className="inline-option">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            required
          />
          I agree to the terms
        </label>

        <div className="button-row">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Employee" : "Add Employee"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/employees")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default EmployeeForm;
