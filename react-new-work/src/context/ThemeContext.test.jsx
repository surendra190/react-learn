import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider, useTheme } from "./ThemeContext";

function ThemeTestComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle theme</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("switches between light and dark and saves the preference", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByText("Current theme: light")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(screen.getByText("Current theme: dark")).toBeInTheDocument();

    await waitFor(() => {
      expect(localStorage.getItem("app-theme")).toBe("dark");
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });
  });
});
