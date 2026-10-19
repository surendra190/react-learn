import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import DeleteEmployee from "./pages/DeleteEmployee";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/employees" element={<EmployeeList />} />

          <Route path="/employees/add" element={<AddEmployee />} />

          <Route path="/employees/edit/:id" element={<EditEmployee />} />

          <Route path="/employees/delete/:id" element={<DeleteEmployee />} />

          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
