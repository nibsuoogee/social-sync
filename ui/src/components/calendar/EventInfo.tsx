import { EditableField } from "@/components/EditableField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TimePicker24h } from "@/components/ui/timePicker";
import { useEventsContext } from "@/contexts/EventsContext";
import { cn } from "@/lib/utils";
import { eventService } from "@/services/event";
import {
  Bars3BottomLeftIcon,
  CheckIcon,
  ClockIcon,
  InformationCircleIcon,
  MapPinIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Event } from "@types";
import { format } from "date-fns";
import { JSX, useState } from "react";

type EventInfoProps = {
  event: Event;
  calendarId: number;
};

export const EventInfo = ({ event, calendarId }: EventInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [temporaryEvent, setTemporaryEvent] = useState<Partial<Event>>({});
  const { contextCalendarsAndEvents, contextSetCalendarsAndEvents } =
    useEventsContext();

  function saveEvent() {
    const newCal = contextCalendarsAndEvents.map((cal) => {
      if (cal.calendar.id !== calendarId) return cal;

      return {
        ...cal,
        events: cal.events.map((e) => {
          if (e.id !== event.id) return e;

          return {
            ...e,
            ...temporaryEvent, // merge only changed fields
          };
        }),
      };
    });
    // 1) use the context calendar handler to update this event
    contextSetCalendarsAndEvents(newCal);

    // 2) send the updated event to the back end
    const patchEventBody = { ...temporaryEvent, id: event.id };
    eventService.patchEvent(patchEventBody);

    // 3) stop editing
    setIsEditing(false);
  }

  function handleTemporaryEvent<K extends keyof Event>(
    key: K,
    value: Event[K]
  ) {
    setTemporaryEvent((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }

  function deleteEvent() {
    // 1) send a delete request to the server but don't wait
    eventService.deleteEvent(event.id);

    // 2) remove the event from the context
    const newCal = contextCalendarsAndEvents.map((cal) => {
      if (cal.calendar.id !== calendarId) return cal;

      return {
        ...cal,
        events: cal.events.filter((e) => e.id !== event.id),
      };
    });

    // 1) use the context calendar handler to update this event
    contextSetCalendarsAndEvents(newCal);
  }

  const elements: {
    icon: React.ForwardRefExoticComponent<
      Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
        title?: string;
        titleId?: string;
      } & React.RefAttributes<SVGSVGElement>
    >;
    content: JSX.Element;
  }[] = [
    {
      icon: InformationCircleIcon,
      content: (
        <EditableField
          className="text-lg"
          value={event.title}
          onSave={(value) => handleTemporaryEvent("title", value)}
          isEditing={isEditing}
        />
      ),
    },
    {
      icon: Bars3BottomLeftIcon,
      content: (
        <EditableField
          value={event.description}
          onSave={(value) => handleTemporaryEvent("description", value)}
          isEditing={isEditing}
          isTextarea
        />
      ),
    },
    {
      icon: ClockIcon,
      content: (
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <>
              <TimePicker24h
                inputDate={temporaryEvent?.start_time ?? event.start_time}
                handleDate={(value) =>
                  handleTemporaryEvent("start_time", value)
                }
              />
              -
              <TimePicker24h
                inputDate={temporaryEvent?.end_time ?? event.end_time}
                handleDate={(value) => handleTemporaryEvent("end_time", value)}
              />
              <Checkbox
                id="all-day"
                checked={temporaryEvent?.all_day ?? event.all_day}
                onCheckedChange={(value) =>
                  handleTemporaryEvent("all_day", value === true)
                }
                className="ml-4"
              />
            </>
          ) : (
            <>
              {event.all_day ? (
                <CheckIcon className="w-6" />
              ) : (
                <>
                  <p>{format(event.start_time, "HH:mm")}</p> -
                  <p>{format(event.end_time, "HH:mm")}</p>
                  <div className="ml-4">
                    <XMarkIcon className="w-6 opacity-30" />
                  </div>
                </>
              )}
            </>
          )}

          <label
            htmlFor="all-day"
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              {
                "opacity-30": !event.all_day && !isEditing,
              }
            )}
          >
            All day
          </label>
        </div>
      ),
    },
    {
      icon: MapPinIcon,
      content: (
        <EditableField
          value={event.location}
          onSave={(value) => handleTemporaryEvent("location", value)}
          isEditing={isEditing}
        />
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 border-black">
      {elements.map((element, index) => (
        <div key={index} className="flex items-center gap-2">
          <element.icon className="w-6 opacity-30 mr-2" />
          <div>{element.content}</div>
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        {isEditing ? (
          <>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="border-black w-20"
            >
              Cancel
            </Button>
            <Button
              onClick={deleteEvent}
              variant="destructive"
              className="ml-auto"
            >
              Delete
            </Button>
            <Button
              onClick={() => saveEvent()}
              variant="outline"
              className="border-black w-20"
            >
              Save
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            size="icon"
            variant="outline"
            className="mr-auto"
          >
            <PencilSquareIcon />
          </Button>
        )}
      </div>
    </div>
  );
};
