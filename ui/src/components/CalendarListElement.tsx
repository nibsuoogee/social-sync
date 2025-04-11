/**
 * a single calendar list elements shown in the main menu.
 */
import { UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";

import { Calendar } from "@types";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarInfoCard } from "./CalendarInfoCard";
import { useEffect, useState } from "react";

export const CalendarListElement = ({
  calendar,
  onDelete,
}: {
  calendar: Calendar;
  onDelete: (id: number) => void;
}) => {
  const [side, setSide] = useState<"right" | "bottom">("right");

  // for knowing which side to render the calendar info card
  useEffect(() => {
    const handleResize = () => {
      setSide(window.innerWidth < 768 ? "bottom" : "right");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full flex items-center justify-start mb-2  border-black"
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
        side={side}
        align="start"
        className="flex w-80 border-black"
      >
        <CalendarInfoCard calendar={calendar} onDelete={onDelete} />
      </PopoverContent>
    </Popover>
  );
};
