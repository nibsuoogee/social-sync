import { Button, Input } from "@mui/joy";
import axios from "axios";
import { useEffect, useState } from "react";

export const CalendarImportForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState("");
  const [calendarName, setCalendarName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!calendarUrl || !calendarName) { 
      setError("Please provide a calendar name and URL");
      setMessage("");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend.localhost/calendar/import-url",
        { url: calendarUrl, name: calendarName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { events } = response.data;
      setMessage(`Calendar imported ${events} events added`);
      setError("");
      setCalendarUrl("");
      setCalendarName("");
      setShowForm(false);
    } catch (err: any) {
      console.error("Import error:", err);
      setError(err.response?.data?.message || err.response?.data || "Failed to import calendar")
      setMessage("");
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(""); setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

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
            placeholder="Calendar name"
            value={calendarName}
            onChange={(e) => setCalendarName(e.target.value)}
            sx={{ mb: 1 }}
          />
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
        <div style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "green" }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
};
