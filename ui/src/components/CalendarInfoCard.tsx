/**
 * This is shown when a user clicks on a calendar on the main menu.
 * It shows the name of the calendar, the color of the calendar, and the description
 */

import { Calendar } from "types";
import { Button } from "./ui/button";
import axios from "axios";

export const CalendarInfoCard = ({
  calendar,
  onDelete,
}: {
  calendar: Calendar;
  onDelete: (id: number) => void;
}) => {
  const deleteCalendar = async () => {
    await axios.delete(`https://backend.localhost/calendar/${calendar.id}`);
    onDelete(calendar.id);
  };

  return (
    <div className="flex flex-col gap-2 border-black">
      <h2
        className="font-mono font-light text-gray-500 text-sm text-left mb-2"
        style={{ color: calendar.color }}
      >
        {calendar.color}
      </h2>
      <h2 className="font-mono font-bold text-left mb-2">{calendar.name}</h2>
      <h2 className="font-mono text-sm text-left mb-2">
        {calendar.description}
      </h2>
      <div className="flex justify-end gap-2">
        {calendar.is_group ? (
          <Button variant={"outline"} className="border-black w-20">
            Leave
          </Button>
        ) : (
          <Button
            onClick={deleteCalendar}
            variant={"outline"}
            className="border-black w-20"
          >
            Delete
          </Button>
        )}

        <Button variant={"outline"} className="border-black w-20">
          Open
        </Button>
      </div>
    </div>
  );
};
