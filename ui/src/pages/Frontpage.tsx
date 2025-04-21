import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const Frontpage = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };
  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div>
      <h1>Social Sync</h1>
      <Button onClick={navigateToLogin}>Login</Button>
      <Button onClick={navigateToRegister}>Register</Button>
    </div>
  );
};
