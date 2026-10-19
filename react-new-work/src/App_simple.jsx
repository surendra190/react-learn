import React, { useState } from "react";
export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    skills: [],
    country: "",
    experience: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

  //Update input,radio,select and checkbox fields
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
    if (form.password.length < 6) {
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (validate()) {
  //     alert("Form submitted successfully!");
  //     console.log("Form Data:", form);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to save employee");
      }

      const data = await response.json();

      console.log("Saved employee:", data);
      alert("Employee added successfully!");

      // Reset the form after saving
      setForm({
        name: "",
        email: "",
        password: "",
        gender: "",
        skills: [],
        country: "",
        experience: "",
        agree: false,
      });

      setErrors({});
    } catch (error) {
      console.error("POST API error:", error);
      alert("Unable to save employee. Please check JSON Server.");
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "30px auto" }}>
      <h2>Employee Registration</h2>

      <form onSubmit={handleSubmit}>
        {/* 1.Text input */}
        <label> Name </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter name"
        />

        <p>{errors.name}</p>

        {/* 2.Email input */}
        <label> Email </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
        />

        <p>{errors.email}</p>

        {/* 3.Password input */}
        <label> Password </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
        />

        <p>{errors.password}</p>

        {/* 4. Radio buttons */}
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

        {/* 5. Multiple checkboxes */}
        <label> Skills </label>
        {["React", "Angular", "Python"].map((skill) => {
          return (
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
          );
        })}
        <p>{errors.skills}</p>

        {/* 6. Select dropdown */}
        <label> Country </label>
        <select name="country" value={form.country} onChange={handleChange}>
          <option value="">Select country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>
        <p>{errors.country}</p>

        {/* 7. Number/experience dropdown */}
        <label> Experience </label>
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

        {/* 8. Single checkbox */}
        <label>
          <input
            type="checkbox"
            name="agree"
            checkbox={form.agree}
            onChange={handleChange}
          />
          I accept the terms and conditions
        </label>
        <p> {errors.agree}</p>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
