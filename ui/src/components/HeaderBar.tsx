import { Button } from "@mui/joy";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export const HeaderBar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navigateToMainMenu = () => {
    navigate("/main-menu");
  };

  return (
    <div>
      <h1 className="font-bold">Header bar</h1>
      <Button onClick={navigateToMainMenu}>Menu</Button>

      {isAuthenticated && <Button onClick={logout}>Logout</Button>}
    </div>
  );
};
