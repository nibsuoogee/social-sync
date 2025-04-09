/**
 * List of calendars shown in the main menu.
 */

import { useEffect, useState } from "react";
import { CalendarListElement } from "./CalendarListElement";
import axios from "axios";
import { Calendar } from "../../types";

export const CalendarList = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axios.get<Calendar[]>(
          "https://backend.localhost/calendars"
        );

        setCalendars(response.data);
      } catch (error) {
        console.error("Error fetching calendars:", error);
      }
    };
    fetchCalendars();
  }, []);

  return (
    <div>
      <h2>calendarlist title</h2>
      {calendars.length !== 0
        ? calendars.map((calendar) => (
            <CalendarListElement key={calendar.id} calendar={calendar} />
          ))
        : "No calendars!"}
    </div>
  );
};
