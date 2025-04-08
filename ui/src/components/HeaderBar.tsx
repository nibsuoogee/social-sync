import { Button } from "@mui/joy";
import { useNavigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

export const HeaderBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navigateToMainMenu = () => {
    navigate("/main-menu");
  };

  return (
    <div>
      <h1>Header bar</h1>
      <Button onClick={navigateToMainMenu}>Menu</Button>
      <ProtectedRoute>
        <Button onClick={logout}>Logout</Button>
      </ProtectedRoute>
    </div>
  );
};
