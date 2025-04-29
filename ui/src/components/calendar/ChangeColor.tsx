import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { membershipService } from "@/services/memberships";
import { zodResolver } from "@hookform/resolvers/zod";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { z } from "zod";

const colorFormSchema = z.object({
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, {
    message: "Color must be a valid hex code (e.g., #ff0000).",
  }),
});

export const ChangeColor = ({ calendar_id }: { calendar_id: number }) => {
  const form = useForm<z.infer<typeof colorFormSchema>>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: {
      color: "#000000",
    },
  });

  async function onSubmit(values: z.infer<typeof colorFormSchema>) {
    membershipService.changeColor({
      calendar_id,
      color: values.color,
    });
  }

  return (
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
                New color in hex code
              </FormDescription>
              <div className="flex justify-between items-center">
                <FormMessage className="mr-2" />
                <Button
                  type="submit"
                  variant="outline"
                  className="border-black ml-auto"
                >
                  Save
                </Button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
