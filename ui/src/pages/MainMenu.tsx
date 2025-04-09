import { CalendarList } from "@/components/CalendarList";
import axios from "axios";
import { useEffect, useState } from "react";

export const MainMenu = () => {
  const [username, setUsername] = useState("");

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
      <CalendarList></CalendarList>
    </div>
  );
};
