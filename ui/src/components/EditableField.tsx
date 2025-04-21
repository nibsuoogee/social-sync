import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";

type EditableFieldProps = {
  className?: string;
  value: string;
  onSave: (val: string) => void;
  isEditing: boolean;
  isTextarea?: true;
};

/**
 * Acts as a text display by default, but on click becomes an editable
 * input element.
 */
export const EditableField = ({
  className,
  value,
  onSave,
  isEditing,
  isTextarea,
}: EditableFieldProps) => {
  const [input, setInput] = useState(value);

  return (
    <div className={cn("text-sm w-full", className)}>
      {isEditing ? (
        <>
          {isTextarea ? (
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={() => {
                onSave(input);
              }}
              autoFocus
            />
          ) : (
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={() => {
                onSave(input);
              }}
              autoFocus
            />
          )}
        </>
      ) : (
        <p className="cursor-text">{value}</p>
      )}
    </div>
  );
};
