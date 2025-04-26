export type {
  UserModelForRegistration,
  UserModelForLogin,
  AccessToken,
} from "../auth/src/models/userModel";

export type {
  Calendar,
  CalendarCreateBody,
  CalendarUpdateBody,
  CalendarViewRequest,
} from "../backend/src/models/calendarModel";

export type {
  Invitation,
  InvitationBody,
  InvitationUpdateBody,
  NewInvitationsResponse,
} from "../backend/src/models/invitationsModel";

export type {
  Event,
  EventModelBody,
  EventUpdateBody,
} from "../backend/src/models/eventsModel";

export type {
  Attendance,
  AttendanceDetails,
} from "../backend/src/models/attendanceModel";

export type {
  Membership,
  GroupMemberInfo,
  MembershipColorUpdateBody,
} from "../backend/src/models/membershipModel";

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
