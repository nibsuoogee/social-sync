import { Button, Input } from "@mui/joy";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send register request to the auth server
      const response = await axios.post("https://auth.localhost/register", {
        username,
        email,
        password,
      });

      // Extract the access token from the response
      const { access_token } = response.data;
      console.log(access_token);
      // Update authentication state using the context
      register(access_token);

      // Redirect to the home page or dashboard
      navigate("/main-menu");
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Username"
          type="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        ></Input>
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
        <Button type="submit">Register</Button>
      </form>
      <Button onClick={navigateToLogin}>Login</Button>
    </div>
  );
};
