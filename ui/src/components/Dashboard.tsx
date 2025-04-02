import { Button } from "@mui/joy";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const Dashboard = () => {
  const [username, setUsername] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://backend.localhost/me");
        setUsername(response.data.username);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>Welcome to your dashboard, {username}!</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};
