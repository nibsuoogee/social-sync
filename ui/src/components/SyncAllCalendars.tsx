import { Button } from "@mui/joy";
import axios from "axios";
import { useState } from "react";

export const SyncAllCalendarsButton = () => {
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncAll = async () => {
    try {
      const response = await axios.post("https://backend.localhost/calendar/sync-all");
      const { message, totalUpdated, totalAdded, totalDeleted } = response.data;

      setSyncMessage(
        `${message}. Updated: ${totalUpdated}, Added: ${totalAdded}, Deleted: ${totalDeleted}`
      );
      setTimeout(() => {
        setSyncMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error("Sync error:", err);
      setSyncMessage(err.response?.data?.message || "Failed to synchronize calendars.");
    }
  };

  return (
    <div>
      <Button onClick={handleSyncAll} variant="outlined" sx={{ mt: 2 }}>
        Sync All Calendars
      </Button>
      {syncMessage && (
        <div style={{ marginTop: "1rem", color: "green", fontSize: "0.9rem" }}>
          {syncMessage}
        </div>
      )}
    </div>
  );
};