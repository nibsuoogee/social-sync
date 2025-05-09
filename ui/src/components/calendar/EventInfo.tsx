import { EditableField } from "@/components/EditableField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TimePicker24h } from "@/components/ui/timePicker";
import { useEventsContext } from "@/contexts/EventsContext";
import { cn } from "@/lib/utils";
import { attendanceService } from "@/services/attendance";
import { eventService } from "@/services/event";
import {
  Bars3BottomLeftIcon,
  CheckIcon,
  ClockIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
  MapPinIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  AttendanceDetails,
  Calendar,
  CalendarViewRequest,
  Event,
  EventEditPermission,
  EventModelBody,
} from "@types";
import { format } from "date-fns";
import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Attendance } from "@/components/calendar/Attendance";

type EventInfoProps = {
  event: Event;
  calendar: Calendar;
  editPermission: EventEditPermission;
};

export const EventInfo = ({
  event,
  calendar,
  editPermission,
}: EventInfoProps) => {
  const { contextSetCalendarView } = useEventsContext();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [temporaryEvent, setTemporaryEvent] = useState<Partial<Event>>({});
  const [attendances, setAttendances] = useState<AttendanceDetails[]>([]);

  function patchEventInContext(partialEvent: Partial<Event>) {
    contextSetCalendarView((prev: CalendarViewRequest) => ({
      ...prev,
      mainCalendar: [
        {
          ...prev.mainCalendar[0],
          events: prev.mainCalendar[0].events.map((e: Event) => {
            if (e.id !== event.id) return e;

            return {
              ...e,
              ...partialEvent, // merge only changed fields
            };
          }),
        },
      ],
    }));
  }

  async function saveEvent() {
    const isProposedEvent = event.status === "tentative";
    if (isProposedEvent) {
      // 1) update the event in the context
      const newEvent: EventModelBody = {
        title: event.title,
        description: event.description,
        location: event.location,
        start_time: new Date(event.start_time),
        end_time: new Date(event.end_time),
        timezone: event.timezone,
        recurrence_rule: event.recurrence_rule,
        ...temporaryEvent,
        calendar_id: calendar.id,
        status: "confirmed",
      };
      const response = await eventService.postEvent(newEvent);
      if (!response) return;

      // 2) update the event in the context
      patchEventInContext(response.event);
    } else {
      // 1) update the event in the context
      patchEventInContext(temporaryEvent);

      // 2) send the updated event to the back end
      const patchEventBody = { ...temporaryEvent, id: event.id };
      eventService.patchEvent(patchEventBody);
    }

    // 3) stop editing
    setIsEditing(false);
  }

  function handleTemporaryEvent<K extends keyof Event>(
    key: K,
    value: Event[K]
  ) {
    setTemporaryEvent((prev: Partial<Event>) => {
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
    contextSetCalendarView((prev: CalendarViewRequest) => ({
      ...prev,
      mainCalendar: [
        {
          ...prev.mainCalendar[0],
          events: prev.mainCalendar[0].events.filter(
            (e: Event) => e.id !== event.id
          ),
        },
      ],
    }));
  }

  function handleEditEvent() {
    switch (editPermission) {
      case "default":
        setIsEditing(true);
        break;
      case "navigate":
        navigate(
          `/calendar/${calendar.is_group ? "group/" : ""}${calendar.id}`
        );
        break;
      case "navigateFullPersonal":
        navigate(`/calendar/all`);
        break;
      case "restrict":
        break;
    }
  }

  async function getAttendance() {
    if (event.status === "tentative") return;

    const attendancesResult = await attendanceService.getAttendances(event.id);
    if (!attendancesResult) return;

    console.log(attendancesResult);

    setAttendances(attendancesResult);
  }

  useEffect(() => {
    if (!calendar.is_group) return;

    getAttendance();
  }, []);

  const elements: {
    icon: React.ForwardRefExoticComponent<
      Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
        title?: string;
        titleId?: string;
      } & React.RefAttributes<SVGSVGElement>
    >;
    content: JSX.Element | undefined;
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
    {
      icon: HandThumbUpIcon,
      content: calendar.is_group ? (
        <Attendance attendances={attendances} event={event} />
      ) : undefined,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 border-black">
      {elements.map((element, index) => (
        <div key={index}>
          {typeof element.content !== "undefined" ? (
            <div className="flex items-center gap-2 w-full">
              <element.icon className="w-6 opacity-30 mr-2" />
              {element.content}
            </div>
          ) : null}
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
            onClick={() => handleEditEvent()}
            variant="outline"
            className="mr-auto border-gray-500 hover:border-gray-800"
            disabled={editPermission === "restrict"}
          >
            <PencilSquareIcon />
            {["navigate", "navigateFullPersonal"].includes(editPermission)
              ? "Go to calendar"
              : ""}
          </Button>
        )}
      </div>
    </div>
  );
};
