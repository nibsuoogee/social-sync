import { Calendar } from "types";
import { Button } from "../ui/button";
import { calendarService } from "@/services/calendar";
import { useCalendarListContext } from "@/contexts/CalendarListContext";
import { useNavigate } from "react-router-dom";
import { membershipService } from "@/services/memberships";
import { ColorBadge } from "@/components/ColorBadge";
import { useState } from "react";
import {
  Bars3BottomLeftIcon,
  InformationCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { getUserIdFromToken } from "@/lib/utils";
import { EditableField } from "../EditableField";
import { Input } from "../ui/input";
import { HexColorPicker } from "react-colorful";

/**
 * This is shown when a user clicks on a calendar on the main menu.
 * It shows the name of the calendar, the color of the calendar, and the description
 */
export const CalendarInfoCard = ({ calendar }: { calendar: Calendar }) => {
  const { contextDeleteCalendar, contextEditCalendar } =
    useCalendarListContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [colorInput, setColorInput] = useState(calendar.color);
  const currentUserId = getUserIdFromToken();
  const [temporaryInfo, setTemporaryInfo] = useState<Partial<Calendar>>({});
  const isOwner = calendar.owner_user_id === currentUserId;

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

  function handleTemporaryInfo<K extends keyof Calendar>(
    key: K,
    value: Calendar[K]
  ) {
    setTemporaryInfo((prev: Partial<Calendar>) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }

  function saveEdits() {
    // 1) overwriting the changed fields to the calendar in the context
    contextEditCalendar({ ...calendar, ...temporaryInfo });

    // 2) patching the edited calendar by sedning only the changes to backend
    const patchCalendarBody = { ...temporaryInfo, id: calendar.id };
    calendarService.patchCalendar(patchCalendarBody);

    // 3) stop editing
    setIsEditing(false);
  }

  function colorHandler(newColor: string) {
    setColorInput(newColor);
    handleTemporaryInfo("color", newColor);
  }

  return (
    <div className="flex flex-col gap-2 border-black">
      {isEditing ? (
        <>
          <Input
            value={colorInput}
            onChange={(e) => colorHandler(e.target.value)}
            autoFocus
          />
          <HexColorPicker
            color={colorInput}
            onChange={(newColor) => colorHandler(newColor)}
          />
        </>
      ) : (
        <ColorBadge text={calendar.color} color={calendar.color} />
      )}
      <div className="flex items-center gap-2 w-full">
        <InformationCircleIcon className="w-6 opacity-30 mr-2" />
        <EditableField
          value={calendar.name}
          onSave={(value) => handleTemporaryInfo("name", value)}
          isEditing={isEditing}
        />
      </div>
      <div className="flex items-center gap-2 w-full">
        <Bars3BottomLeftIcon className="w-6 opacity-30 mr-2" />
        <EditableField
          value={calendar.description}
          onSave={(value) => handleTemporaryInfo("description", value)}
          isEditing={isEditing}
          isTextarea
        />
      </div>

      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="border-black w-20"
            >
              Cancel
            </Button>

            <Button
              onClick={() => saveEdits()}
              variant="outline"
              className="border-black w-20"
            >
              Save
            </Button>
            <Button
              onClick={calendar.is_group ? leaveGroupCalendar : deleteCalendar}
              variant="destructive"
              className="ml-auto"
            >
              {calendar.is_group ? "Leave" : "Delete"}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={openCalendar}
              variant={"outline"}
              className="border-black w-20"
            >
              Open
            </Button>

            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="mr-auto border-gray-500 hover:border-gray-800"
              disabled={!isOwner}
            >
              <PencilSquareIcon />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
