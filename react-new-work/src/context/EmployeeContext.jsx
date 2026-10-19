import { createContext, useContext, useEffect, useState } from "react";
import { useCallback } from "react";
const API_URL = "http://localhost:3000/employees";

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // READ: fetch all employees when the provider mounts.
  async function fetchEmployees() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load employees.");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  // READ: fetch one employee by ID for the Edit/Delete pages.
  async function getEmployeeByIdWithout(id) {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Employee not found.");
    }

    return response.json();
  }

  // Inside EmployeeProvider:
  const getEmployeeById = useCallback(async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Employee not found.");
    }

    return response.json();
  }, []);

  // CREATE: add an employee.
  async function addEmployee(employee) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    if (!response.ok) {
      throw new Error("Unable to add employee.");
    }

    const savedEmployee = await response.json();

    setEmployees((previous) => [...previous, savedEmployee]);

    return savedEmployee;
  }

  // UPDATE: update an existing employee.
  async function updateEmployee(id, employee) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    if (!response.ok) {
      throw new Error("Unable to update employee.");
    }

    const updatedEmployee = await response.json();

    setEmployees((previous) =>
      previous.map((item) =>
        String(item.id) === String(id) ? updatedEmployee : item,
      ),
    );

    return updatedEmployee;
  }

  // DELETE: remove an employee.
  async function deleteEmployee(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete employee.");
    }

    setEmployees((previous) =>
      previous.filter((item) => String(item.id) !== String(id)),
    );
  }

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        fetchEmployees,
        getEmployeeById,
        addEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

// Custom hook: convenient access to the employee context.
export function useEmployees() {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error("useEmployees must be used inside EmployeeProvider");
  }

  return context;
}
