import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import EmployeeForm from "./EmployeeForm";
import { useEmployees } from "../context/EmployeeContext";

vi.mock("../context/EmployeeContext", () => ({
  useEmployees: vi.fn(),
}));

const employee = {
  id: 1,
  name: "Rahul",
  email: "rahul@example.com",
  password: "secret123",
  gender: "Male",
  skills: ["React"],
  country: "India",
  experience: "5",
  agree: true,
};

const mockAddEmployee = vi.fn();
const mockUpdateEmployee = vi.fn();
const mockGetEmployeeById = vi.fn();

function renderForm(path = "/employees/add") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/employees/add" element={<EmployeeForm />} />
        <Route path="/employees/edit/:id" element={<EmployeeForm isEdit />} />
        <Route path="/employees" element={<h1>Employee List Page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  mockAddEmployee.mockResolvedValue({ id: 2 });
  mockUpdateEmployee.mockResolvedValue({ ...employee, name: "Rahul Sharma" });
  mockGetEmployeeById.mockResolvedValue({ ...employee });

  useEmployees.mockReturnValue({
    addEmployee: mockAddEmployee,
    updateEmployee: mockUpdateEmployee,
    getEmployeeById: mockGetEmployeeById,
  });
});

describe("EmployeeForm", () => {
  it("adds a new employee with valid form data", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.type(screen.getByLabelText("Name"), "Amit Kumar");

    await user.type(screen.getByLabelText("Email"), "amit@example.com");

    await user.type(screen.getByLabelText("Password"), "secret123");

    await user.click(screen.getByLabelText("Male"));
    await user.click(screen.getByLabelText("React"));

    await user.selectOptions(screen.getByLabelText("Country"), "India");

    await user.type(screen.getByLabelText("Experience (years)"), "3");

    await user.click(screen.getByLabelText("I agree to the terms"));

    await user.click(screen.getByRole("button", { name: "Add Employee" }));

    await waitFor(() => {
      expect(mockAddEmployee).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Amit Kumar",
          email: "amit@example.com",
          gender: "Male",
          skills: ["React"],
          country: "India",
          experience: "3",
          agree: true,
        }),
      );
    });

    expect(mockUpdateEmployee).not.toHaveBeenCalled();
  });

  it("loads an employee and updates the existing record", async () => {
    const user = userEvent.setup();

    renderForm("/employees/edit/1");

    const nameInput = await screen.findByLabelText("Name");

    await waitFor(() => {
      expect(nameInput).toHaveValue("Rahul");
    });

    expect(mockGetEmployeeById).toHaveBeenCalledWith("1");

    await user.clear(nameInput);
    await user.type(nameInput, "Rahul Sharma");

    await user.click(screen.getByRole("button", { name: "Update Employee" }));

    await waitFor(() => {
      expect(mockUpdateEmployee).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          name: "Rahul Sharma",
          email: "rahul@example.com",
        }),
      );
    });

    expect(mockAddEmployee).not.toHaveBeenCalled();
  });
});
