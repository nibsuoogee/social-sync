import { Button, Input } from "@mui/joy";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send login request to the auth server
      const response = await axios.post("https://auth.localhost/login", {
        email,
        password,
      });

      // Extract the access token from the response
      const { access_token } = response.data;

      // Update authentication state using the context
      login(access_token);

      // Redirect to the home page or dashboard
      navigate("/main-menu");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="E-mail"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        ></Input>
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        ></Input>
        <Button type="submit">Login</Button>
      </form>
      <Button onClick={navigateToRegister}>Register</Button>
    </div>
  );
};
