import { Button, Input } from "@mui/joy";
import { useState } from "react";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1>Register</h1>
      <Input
        placeholder="E-mail"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      ></Input>
      <Input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      ></Input>
      <Button>Submit</Button>
    </div>
  );
};
