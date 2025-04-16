import { Button } from "@/components/ui/button";
import { isoDateToHoursMinutes } from "@/lib/dates";
import { cn } from "@/lib/utils";

/**
 * Event blocks populate calendar cells. They have a background colour,
 * start and end time text, title text, and an invisible, solid, or
 * dashed border.
 */
export const EventBlock = ({
  bgColor,
  borderColor = "transparent",
  title,
  customClass,
  startTime,
  endTime,
  allDay,
}: {
  bgColor: string;
  borderColor?: string;
  title: string;
  customClass?: string;
  startTime?: Date;
  endTime?: Date;
  allDay?: boolean;
}) => {
  const startTimeText = allDay
    ? "All"
    : startTime
    ? isoDateToHoursMinutes(startTime)
    : "";
  const endTimeText = allDay
    ? "day"
    : endTime
    ? isoDateToHoursMinutes(endTime)
    : "";

  return (
    <>
      <Button
        size={"sm"}
        variant={"default"}
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
        className={cn(
          customClass,
          "text-xs line-clamp-2 truncate whitespace-normal items-start text-left justify-start px-1 m-0 rounded-sm w-full hover:brightness-90"
        )}
      >
        <div className="grid grid-cols-[25%_75%] divide-x-1 divide-solid divide-gray-200 gap-1">
          <div className="flex flex-col justify-start">
            <div>{startTimeText}-</div>
            <div>{endTimeText}</div>
          </div>
          <div className="line-clamp-2 overflow-hidden text-ellipsis w-full">
            {title}
          </div>
        </div>
      </Button>
    </>
  );
};
