import { CalendarList } from "@/components/CalendarList";
import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar } from "../../types";
//import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export const MainMenu = () => {
  const [username, setUsername] = useState("");
  const [personalCalendars, setPersonalCalendars] = useState<Calendar[]>([]);
  const [groupCalendars, setGroupCalendars] = useState<Calendar[]>([]);

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

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axios.get<Calendar[]>(
          "https://backend.localhost/calendars"
        );
        setPersonalCalendars(
          response.data.filter((calendar) => !calendar.is_group)
        );
        setGroupCalendars(
          response.data.filter((calendar) => calendar.is_group)
        );
      } catch (error) {
        console.error("Error fetching calendars:", error);
      }
    };
    fetchCalendars();
  }, []);

  return (
    <div>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col w-128 flex-initial">
          <div className="p-6 flex flex-col">
            <h2 className="font-mono text-left mb-2">Personal Calendars</h2>
            <CalendarList calendars={personalCalendars}></CalendarList>
          </div>
          <div className="p-4">
            <h2 className="font-mono text-left mb-2">Group Calendars</h2>
            <CalendarList calendars={groupCalendars}></CalendarList>
          </div>
        </div>

        <div>
          <h2>invitations to groups here</h2>
        </div>
      </div>
    </div>
  );
};
