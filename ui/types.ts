export type {
  UserModelForRegistration,
  UserModelForLogin,
  AccessToken,
} from "../auth/dist/models/userModel";

export type {
  Calendar,
  CalendarCreateBody,
  CalendarUpdateBody,
  CalendarViewRequest,
  CalendarAndEvents,
} from "../backend/dist/models/calendarModel";

export type {
  Invitation,
  InvitationBody,
  InvitationUpdateBody,
  NewInvitationsResponse,
} from "../backend/dist/models/invitationsModel";

export type {
  Event,
  EventModelBody,
  EventUpdateBody,
} from "../backend/dist/models/eventsModel";

export type {
  Attendance,
  AttendanceDetails,
  AttendanceUpdateBody,
} from "../backend/dist/models/attendanceModel";

export type {
  Membership,
  GroupMemberInfo,
  MembershipColorUpdateBody,
} from "../backend/dist/models/membershipModel";

export type CalendarVariant = "single" | "fullPersonal" | "group";

export type CalendarViewKey =
  | "mainCalendar"
  | "personalCalendars"
  | "groupMemberCalendars";

export type EventEditPermission =
  | "default"
  | "navigate"
  | "navigateFullPersonal"
  | "restrict";
