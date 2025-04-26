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
    <div className="flex flex-col items-center gap-2 justify-center min-h-[calc(100vh-80px)]">
      <h1 className="text-2xl font-bold">Welcome to Social Sync</h1>
      <div className="flex flex-row gap-3">
        <Button onClick={navigateToLogin}>Login</Button>
        <Button onClick={navigateToRegister}>Register</Button>
      </div>
    </div>
  );
};
