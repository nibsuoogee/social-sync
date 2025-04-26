import { Badge } from "@/components/ui/badge";
import { textColorByLuminance } from "@/lib/color";
import { cn } from "@/lib/utils";

type ColorBadgeProps = { text: string; color: string; className?: string };

/**
 * Display a badge with a hex background color.
 * @param color A color in hex form.
 */
export const ColorBadge = ({ text, color, className }: ColorBadgeProps) => {
  return (
    <Badge
      style={{
        backgroundColor: color,
        color: textColorByLuminance(color),
      }}
      className={cn(`w-min text-nowrap`, className)}
    >
      {text}
    </Badge>
  );
};
