/**
 * a single calendar list elements shown in the main menu.
 */
import { Card } from "@/components/ui/card";
import { StarIcon } from "@heroicons/react/24/outline";
import { Calendar } from "../../types";

export const CalendarListElement = ({ calendar }: { calendar: Calendar }) => {
  return (
    <Card className="flex-row">
      <StarIcon className="size-6 " />
      <h2>{calendar.name}</h2>
    </Card>
  );
};
