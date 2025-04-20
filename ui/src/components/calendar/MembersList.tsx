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
import { cn } from "@/lib/utils";
import { invitationService } from "@/services/invitation";
import { membershipService } from "@/services/memberships";
import { UserIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupMemberInfo } from "@types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const MembersList = ({ calendar_id }: { calendar_id: number }) => {
  const [showNewMemberInput, setShowNewMemberInput] = useState(false);
  const [members, setMembers] = useState<GroupMemberInfo[]>([]);

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

  async function getMembers() {
    if (typeof calendar_id === "undefined") return;

    const membersResult = await membershipService.getMembers(calendar_id);
    if (!membersResult) return;

    setMembers(membersResult);
  }

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {members.map((member) => (
        <Button
          key={member.id}
          variant="outline"
          className="flex items-center justify-start border-black"
        >
          <UserIcon className="size-6 ml-2" style={{ color: member.color }} />
          <h4>
            {member.username} - {member.email}
          </h4>
        </Button>
      ))}
      <Button
        onClick={() => setShowNewMemberInput(!showNewMemberInput)}
        variant="outline"
        className={cn("flex items-center justify-start border-black", {
          "bg-zinc-300": showNewMemberInput,
        })}
      >
        <UserPlusIcon className="size-6 ml-2" style={{ color: "#000000" }} />
        <h3 className="font-mono">Add member</h3>
      </Button>

      {showNewMemberInput ? (
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
      ) : null}
    </div>
  );
};
