import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";

import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/tasks" : "/login"} replace />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/tasks" replace /> : <RegisterPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/tasks" replace /> : <LoginPage />}
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
