import { UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Calendar } from "@types";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarInfoCard } from "./CalendarInfoCard";

/**
 * a single calendar list elements shown in the main menu.
 */
export const CalendarListElement = ({ calendar }: { calendar: Calendar }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full flex items-center justify-start mb-2 border-black"
        >
          {calendar.is_group ? (
            <UserGroupIcon
              className="size-6 ml-4"
              style={{ color: calendar.color }}
            />
          ) : (
            <UserIcon
              className="size-6 ml-2"
              style={{ color: calendar.color }}
            />
          )}
          <h3 className="font-mono">{calendar.name}</h3>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        flipXonMdScreenWidth
        side="right"
        align="start"
        className="flex w-80 border-black"
      >
        <CalendarInfoCard calendar={calendar} />
      </PopoverContent>
    </Popover>
  );
};
