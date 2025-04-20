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
import { invitationService } from "@/services/invitation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const AddMember = ({ calendar_id }: { calendar_id: number }) => {
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof inviteSchema>) {
    const result = await invitationService.postInvite({
      ...values,
      calendar_id,
    });
    if (!result) return;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription className="font-mono text-xs">
                New member email
              </FormDescription>
              <div className="flex justify-between items-center">
                <FormMessage className="mr-2" />
                <Button
                  type="submit"
                  variant="outline"
                  className="border-black ml-auto"
                >
                  Send
                </Button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
