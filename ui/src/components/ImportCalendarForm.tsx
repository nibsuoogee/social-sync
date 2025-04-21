import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { importService } from "@/services/import";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "./ui/form";
import { Calendar } from "@types";

const importFormSchema = z.object({
  external_source_url: z.string().min(2, {
    message: "url must be at least 2 characters.",
  }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, {
    message: "Color must be a valid hex code (e.g., #ff0000).",
  }),
  external_source_name: z.string().min(2, {
    message: "source must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Descripion must be at least 2 characters.",
  }),
});

export const ImportCalendarForm = ({
  addCalendar,
}: {
  addCalendar: (calendar: Calendar) => void;
}) => {
  // 1. defining form
  const form = useForm<z.infer<typeof importFormSchema>>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      external_source_url: "",
      color: "#000000",
      external_source_name: "",
      name: "",
      description: "",
    },
  });

  // 2. defining submit handler
  async function onSubmit(values: z.infer<typeof importFormSchema>) {
    const result = await importService.postCalendar({
      ...values,
      is_group: false,
    });
    if (!result) return;
    addCalendar(result.calendar);
  }

  type ImportFormSchemaType = z.infer<typeof importFormSchema>;

  type FormVariables = {
    name: keyof ImportFormSchemaType;
    placeholder: string;
    description: string;
  };

  const forms: FormVariables[] = [
    {
      name: "external_source_url",
      placeholder: ".ics URL",
      description: "Paste the URL of the .ics file",
    },
    {
      name: "external_source_name",
      placeholder: "Source",
      description: "Enter the source of the calendar (e.g, Google Calendar)",
    },
    {
      name: "color",
      placeholder: "Color",
      description: "Color in hex code",
    },
    {
      name: "name",
      placeholder: "Title",
      description: "Name for your calendar",
    },
    {
      name: "description",
      placeholder: "Description",
      description: "Tell what your calendar is about",
    },
  ];

  return (
    <div className="max-h-[500px] overflow-auto ">
      <h2 className="font-bold text-sm text-left mb-2">Import Calendar</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {forms.map((formItem) => (
            <FormField
              key={formItem.name}
              control={form.control}
              name={formItem.name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={formItem.placeholder} {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {formItem.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="submit"
            variant={"outline"}
            className="border-black w-20"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
