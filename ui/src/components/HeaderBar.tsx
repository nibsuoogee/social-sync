import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

export const HeaderBar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navigateToMainMenu = () => {
    navigate("/main-menu");
  };

  return (
    <div className="flex justify-between items-center p-4 border-black border-b-2">
      <h1 className="font-bold text-2xl font-mono">Social Sync</h1>
      <div className="flex gap-4">
        {isAuthenticated && <Button onClick={navigateToMainMenu}>Menu</Button>}
        {isAuthenticated && <Button onClick={logout}>Logout</Button>}
      </div>
    </div>
  );
};
