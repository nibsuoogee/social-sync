import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TimePicker24h } from "@/components/ui/timePicker";

export const EventInfo = () => {
  return (
    <div className="w-full flex flex-col gap-2 border-black">
      <h2 className="font-bold text-left mb-2">Title</h2>
      <h2 className="text-sm text-left mb-2">Description</h2>
      <div className="flex gap-2 items-center">
        <TimePicker24h />
        -
        <TimePicker24h />
        <Checkbox id="all-day" />
        <label
          htmlFor="all-day"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          All day
        </label>
      </div>

      <h2 className="text-sm text-left mb-2">Location</h2>
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => null}
          variant={"outline"}
          className="border-black w-20"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
