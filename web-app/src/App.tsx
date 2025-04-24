// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import AppLayout from "./components/Layout";
import Board from "./pages/Tasks/Board";
import Task from "./pages/Tasks/Task";
import ManageUsers from "./pages/users/ManageUsers";

function App() {
  const role = localStorage.getItem("role");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {role === "admin" ? (
          <>
            <Route
              path="/admin-dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            <Route
              path="/task"
              element={
                <AppLayout >
                  <Task />
                </AppLayout>
              }
            />
            <Route
              path="/ManageUsers"
              element={
                <AppLayout >
                  <ManageUsers />
                </AppLayout>
              }
            />
          </>
        ) : (
          <Route
            path="/user-board"
            element={
              <AppLayout>
                <Board />
              </AppLayout>
            }
          />
        )}

        {/* Add more protected routes under AppLayout */}
      </Routes>
    </Router>
  );
}

export default App;
