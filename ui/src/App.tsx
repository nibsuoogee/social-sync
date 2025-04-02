import "./App.css";
import axios from "axios";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Frontpage } from "./components/Frontpage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";

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
        <Routes>
          <Route path="/" element={<Frontpage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
