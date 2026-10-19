import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import DeleteEmployee from "./DeleteEmployee";
import { useEmployees } from "../context/EmployeeContext";

vi.mock("../context/EmployeeContext", () => ({
  useEmployees: vi.fn(),
}));

const mockDeleteEmployee = vi.fn();
const mockGetEmployeeById = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  mockGetEmployeeById.mockResolvedValue({
    id: 1,
    name: "Rahul",
    email: "rahul@example.com",
  });

  mockDeleteEmployee.mockResolvedValue(undefined);

  useEmployees.mockReturnValue({
    getEmployeeById: mockGetEmployeeById,
    deleteEmployee: mockDeleteEmployee,
  });
});

describe("DeleteEmployee", () => {
  it("deletes the selected employee after confirmation", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/employees/delete/1"]}>
        <Routes>
          <Route path="/employees/delete/:id" element={<DeleteEmployee />} />
          <Route path="/employees" element={<h1>Employee List Page</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Rahul/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirm Delete" }));

    await waitFor(() => {
      expect(mockDeleteEmployee).toHaveBeenCalledWith("1");
    });

    expect(
      await screen.findByRole("heading", {
        name: "Employee List Page",
      }),
    ).toBeInTheDocument();
  });
});
