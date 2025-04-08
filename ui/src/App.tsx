import "./App.css";
import axios from "axios";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Frontpage } from "./pages/Frontpage";
import ProtectedRoute from "./components/ProtectedRoute";
import { MainMenu } from "./pages/MainMenu";
import { AuthProvider } from "./contexts/AuthContext";
import { PageShell } from "./components/PageShell";
import { Calendar } from "./pages/Calendar";

function App() {
  useEffect(() => {
    // Add request interceptor to add token to all requests
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle unauthorized errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // If unauthorized, clear token and redirect to login
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Router>
      <AuthProvider>
        <PageShell>
          <Routes>
            <Route path="/" element={<Frontpage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/main-menu"
              element={
                <ProtectedRoute>
                  <MainMenu />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar />
                </ProtectedRoute>
              }
            />
          </Routes>
        </PageShell>
      </AuthProvider>
    </Router>
  );
}

export default App;
