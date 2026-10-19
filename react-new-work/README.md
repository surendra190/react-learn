# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Employee_crud

Add testing steps

For your Employee Management System, I recommend starting with 5 high-value tests covering CRUD operations, validation, Context API, and theme switching. These will give you good practical experience with React testing and are useful examples for interviews.

We'll use Vitest + React Testing Library because your project uses React with Vite.

1. Install the testing libraries
   Run this in your React project:
   npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

Update the scripts section in package.json:
{
"scripts": {
"dev": "vite",
"build": "vite build",
"test": "vitest",
"test:run": "vitest run"
}
}

Keep any other scripts already in your package.json.

Create or update vite.config.js:
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
plugins: [react()],
test: {
environment: "jsdom",
setupFiles: "./src/test/setup.js",
},
});

If your project uses vite.config.ts, make these changes there instead.

Create src/test/setup.js:
import "@testing-library/jest-dom/vitest";

2. Add a test folder
   src/
   test/setup.js

pages/
EmployeeList.test.jsx

AddEmployee.test.jsx

components/
EmployeeForm.test.jsx

context/
EmployeeContext.test.jsx

ThemeContext.test.jsx

We'll mock the API calls in tests so they run without needing JSON Server to be running. The examples below assume your current Context and component files export useEmployees, EmployeeProvider, useTheme, and ThemeProvider as described earlier.
