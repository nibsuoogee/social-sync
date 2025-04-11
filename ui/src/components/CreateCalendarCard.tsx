/**
 * This is shown when a user wants to create a new calendar.
 */

import { Button } from "./ui/button";
import axios from "axios";
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

const calendarFormSchema = z.object({
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Color must be a valid hex code (e.g., #ff0000 or #f00).",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Descripion must be at least 2 characters.",
  }),
});

export const CreateCalendarCard = () => {
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
    await axios.post("https://backend.localhost/calendar", {
      name: values.title,
      description: values.description,
      is_group: false,
      color: values.color,
    });
    console.log(values);
  }

  return (
    <div className="flex flex-col border-black">
      <h2 className="font-mono font-bold text-sm text-left mb-2">
        Create New Calendar
      </h2>
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
