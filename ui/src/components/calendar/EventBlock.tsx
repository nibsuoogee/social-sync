import { EventInfo } from "@/components/calendar/EventInfo";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { textColorByLuminance } from "@/lib/color";
import { isoDateToHoursMinutes } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { Calendar, Event, EventEditPermission } from "@types";

type EventBlockProps = {
  event: Event;
  calendar: Calendar;
  bgColor: string;
  customClass?: string;
  borderStyle?: string;
  editPermission: EventEditPermission;
};

/**
 * Event blocks populate calendar cells. They have a background colour,
 * start and end time text, title text, and an invisible, solid, or
 * dashed border.
 */
export const EventBlock = ({
  event,
  calendar,
  bgColor,
  customClass,
  borderStyle,
  editPermission,
}: EventBlockProps) => {
  const startTimeText = event.all_day
    ? "All"
    : event.start_time
    ? isoDateToHoursMinutes(event.start_time)
    : "";
  const endTimeText = event.all_day
    ? "day"
    : event.end_time
    ? isoDateToHoursMinutes(event.end_time)
    : "";
  const textColor = textColorByLuminance(bgColor);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={"sm"}
            variant={"default"}
            style={{
              backgroundColor: bgColor,
            }}
            className={cn(
              `text-${textColor}`,
              customClass,
              "text-xs line-clamp-2 truncate whitespace-normal items-start text-left justify-start px-1 m-0 rounded-sm w-full hover:brightness-90",
              {
                "border border-gray-800 border-solid": borderStyle === "solid",
                "border border-gray-800 border-dashed":
                  borderStyle === "dashed",
              }
            )}
          >
            <div
              className={cn(
                bgColor === "transparent" ? "divide-none" : "divide-solid",
                "grid grid-cols-[28%_72%] divide-x-1 gap-1",
                {
                  "divide-black": textColor === "black",
                  "divide-white": textColor === "white",
                }
              )}
            >
              <div className="flex flex-col justify-start">
                <div>{startTimeText}-</div>
                <div>{endTimeText}</div>
              </div>
              <div className="line-clamp-2 overflow-hidden text-ellipsis w-full">
                {event.title}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          className="flex w-100 border-black"
        >
          <EventInfo
            event={event}
            calendar={calendar}
            editPermission={editPermission}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
