import { Button } from "@/components/ui/button";
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
}: {
  bgColor: string;
  borderColor?: string;
  title: string;
  customClass?: string;
}) => {
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
          "justify-start p-1 m-0 h-4 rounded-sm w-full hover:brightness-90"
        )}
      >
        {title}
      </Button>
    </>
  );
};
