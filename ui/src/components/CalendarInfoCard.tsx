import { Calendar } from "types";
import { Button } from "./ui/button";
import { calendarService } from "@/services/calendar";
import { useCalendarListContext } from "@/contexts/CalendarListContext";
import { useNavigate } from "react-router-dom";
import { membershipService } from "@/services/memberships";
import { Badge } from "@/components/ui/badge";
import { getTextColor } from "@/lib/color";

/**
 * This is shown when a user clicks on a calendar on the main menu.
 * It shows the name of the calendar, the color of the calendar, and the description
 */
export const CalendarInfoCard = ({ calendar }: { calendar: Calendar }) => {
  const { contextDeleteCalendar } = useCalendarListContext();
  const navigate = useNavigate();

  const deleteCalendar = async () => {
    calendarService.deleteCalendar(calendar.id);
    // We could await a result, but UX is better if the calendar
    // is remove instantly without checking if the server agrees

    contextDeleteCalendar(calendar.id);
  };

  const leaveGroupCalendar = async () => {
    membershipService.deleteMembership(calendar.id);

    contextDeleteCalendar(calendar.id);
  };

  const openCalendar = async () => {
    // navigate to the calendar
    navigate(`/calendar/${calendar.is_group ? "group/" : ""}${calendar.id}`);
  };

  /**
   * Display a badge with the hex value in text and the color
   * itself as the background.
   * @param color A color in hex form.
   */
  function colourBadge(color: string) {
    const textColor = getTextColor(color);
    return (
      <Badge
        style={{
          backgroundColor: color,
        }}
        className={`text-${textColor} w-min`}
      >
        {color}
      </Badge>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-black">
      {colourBadge(calendar.color)}
      <h2 className="font-mono font-bold text-left mb-2">{calendar.name}</h2>
      <h2 className="font-mono text-sm text-left mb-2">
        {calendar.description}
      </h2>
      <div className="flex justify-end gap-2">
        {calendar.is_group ? (
          <Button
            onClick={leaveGroupCalendar}
            variant={"outline"}
            className="border-black w-20"
          >
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

        <Button
          onClick={openCalendar}
          variant={"outline"}
          className="border-black w-20"
        >
          Open
        </Button>
      </div>
    </div>
  );
};
