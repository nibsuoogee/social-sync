import { Badge } from "@/components/ui/badge";

type ColorBadgeProps = { text: string; color: string };

/**
 * Display a badge with a hex background color.
 * @param color A color in hex form.
 */
export const ColorBadge = ({ text, color }: ColorBadgeProps) => {
  return (
    <Badge
      style={{
        backgroundColor: color,
      }}
      className={`text-${text} w-min`}
    >
      {text}
    </Badge>
  );
};
