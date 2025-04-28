import { ColorBadge } from "@/components/ColorBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserIdFromToken } from "@/lib/utils";
import { attendanceService } from "@/services/attendance";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AttendanceDetails, Event } from "@types";
import { useEffect, useState } from "react";

function attendanceColor(status: AttendanceDetails["status"]): string {
  switch (status) {
    case "needs-action":
      return ` #ffdd11`;
    case "tentative":
      return `rgb(177, 63, 252)`;
    case "accepted":
      return `rgb(16, 255, 143)`;
    case "declined":
      return `rgb(255, 17, 100)`;
  }
  return "#000000";
}

const statusText: Record<AttendanceDetails["status"], string> = {
  "needs-action": "Needs action",
  tentative: "Tentative",
  accepted: "Accepted",
  declined: "Declined",
};

type AttendanceProps = {
  attendances: AttendanceDetails[];
  event: Event;
};

export const Attendance = ({ attendances, event }: AttendanceProps) => {
  const [myAttendance, setMyAttendance] =
    useState<AttendanceDetails["status"]>("needs-action");
  const [currentUserId] = useState(getUserIdFromToken());

  function handleMyAttendance(
    newStatus: AttendanceDetails["status"],
    membership_id: number
  ) {
    if (!currentUserId) return;

    // 1) set the attendance in the state
    setMyAttendance(newStatus);

    // 2) patch the attendance on the server
    attendanceService.patchAttendance({
      event_id: event.id,
      membership_id: membership_id,
      status: newStatus,
    });
  }

  // Set the user's status if it exists
  useEffect(() => {
    const myAttendance = attendances.find((a) => a.user_id === currentUserId);
    if (!myAttendance?.status) return;

    setMyAttendance(myAttendance.status);
  }, [attendances, currentUserId]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {attendances?.map((attendance, index) => {
        const isCurrentUser = attendance.user_id === currentUserId;
        return (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="line-clamp-2 truncate whitespace-normal">
              {attendance.username}
            </div>

            {isCurrentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-38 justify-between">
                    <ChevronDownIcon className="w-4" />
                    <ColorBadge
                      text={statusText[myAttendance]}
                      color={attendanceColor(myAttendance)}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="start">
                  <DropdownMenuLabel>Attendance</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={myAttendance}
                    onValueChange={(value) =>
                      handleMyAttendance(
                        value as AttendanceDetails["status"],
                        attendance.membership_id
                      )
                    }
                  >
                    <DropdownMenuRadioItem value="accepted">
                      Accepted
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="declined">
                      Declined
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="tentative">
                      Tentative
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="w-38 flex justify-end items-center pr-3">
                <ColorBadge
                  text={statusText[attendance.status]}
                  color={attendanceColor(attendance.status)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
