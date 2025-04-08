import { Button, Input } from "@mui/joy";
import axios from "axios";
import { useEffect, useState } from "react";

export const CalendarImportForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleImport = async () => {
    if (!calendarUrl) return;

    try {
      const response = await axios.post(
        "https://backend.localhost/calendar/import-url",
        { url: calendarUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { events } = response.data;
      setMessage(`Calendar imported ${events} events added`);
      setCalendarUrl("");
      setShowForm(false);
    } catch (err: any) {
      console.error("Import error:", err);
      setMessage(
        ` ${err.response?.data?.message || "Failed to import calendar"}`
      );
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div style={{ position: "relative" }}>
      <Button
        variant="outlined"
        onClick={() => setShowForm((prev) => !prev)}
      >
        ⬆ Import
      </Button>
  
      {showForm && (
        <div style={{ marginTop: "1rem" }}>
          <Input
            placeholder="Paste .ics URL"
            value={calendarUrl}
            onChange={(e) => setCalendarUrl(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button onClick={handleImport} fullWidth>
            Create
          </Button>
        </div>
      )}
  
      {message && (
        <div style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "#666" }}>
          {message}
        </div>
      )}
    </div>
  );
};
