import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import EmployeeList from "./EmployeeList";
import { useEmployees } from "../context/EmployeeContext";

vi.mock("../context/EmployeeContext", () => ({
  useEmployees: vi.fn(),
}));

describe("EmployeeList", () => {
  it("renders employee records from Context", () => {
    useEmployees.mockReturnValue({
      employees: [
        {
          id: 1,
          name: "Rahul",
          email: "rahul@example.com",
          gender: "Male",
          skills: ["React", "Python"],
          country: "India",
          experience: "5",
        },
      ],
      loading: false,
      error: "",
    });

    render(
      <MemoryRouter>
        <EmployeeList />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Employee List" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Rahul")).toBeInTheDocument();
    expect(screen.getByText("rahul@example.com")).toBeInTheDocument();
    expect(screen.getByText("React, Python")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/employees/edit/1",
    );

    expect(screen.getByRole("link", { name: "Delete" })).toHaveAttribute(
      "href",
      "/employees/delete/1",
    );
  });
});
