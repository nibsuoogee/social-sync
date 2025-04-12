import { Button, Input } from "@mui/joy";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user";

export const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send login request to the auth server
    const auth = await userService.postLogin({
      email,
      password,
    });
    if (!auth) return;

    // Extract the access token from the response
    const { access_token } = auth;

    // Update authentication state using the context
    login(access_token);

    // Redirect to the home page or dashboard
    navigate("/main-menu");
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
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </form>
      <Button onClick={navigateToRegister}>Register</Button>
    </div>
  );
};
