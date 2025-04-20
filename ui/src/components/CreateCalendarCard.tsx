/**
 * This is shown when a user wants to create a new calendar.
 */

import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "./ui/form";
import { Input } from "./ui/input";
import { calendarService } from "@/services/calendar";
import { Calendar } from "@types";
import { HexColorPicker } from "react-colorful";

const calendarFormSchema = z.object({
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, {
    message: "Color must be a valid hex code (e.g., #ff0000).",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Descripion must be at least 2 characters.",
  }),
});

export const CreateCalendarCard = ({
  isGroup,
  addCalendar,
}: {
  isGroup: boolean;
  addCalendar: (calendar: Calendar) => void;
}) => {
  // 1. defining form
  const form = useForm<z.infer<typeof calendarFormSchema>>({
    resolver: zodResolver(calendarFormSchema),
    defaultValues: {
      color: "#000000",
      title: "",
      description: "",
    },
  });

  // 2. defining submit handler
  async function onSubmit(values: z.infer<typeof calendarFormSchema>) {
    const result = await calendarService.postCalendar({
      name: values.title,
      description: values.description,
      is_group: isGroup,
      color: values.color,
    });
    if (!result) return;
    addCalendar(result.calendar);
  }

  return (
    <div className="flex flex-col border-black">
      {isGroup ? (
        <h2 className="font-mono font-bold text-sm text-left mb-2">
          Create New Group Calendar
        </h2>
      ) : (
        <h2 className="font-mono font-bold text-sm text-left mb-2">
          Create New Personal Calendar
        </h2>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Color" {...field} />
                </FormControl>
                <HexColorPicker color={field.value} onChange={field.onChange} />
                <FormDescription className="font-mono text-xs">
                  Color in hex code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription className="font-mono text-xs">
                  Name for your calendar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormDescription className="font-mono text-xs">
                  Tell what your calendar is about
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={"outline"}
            className="border-black w-20"
          >
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
};
