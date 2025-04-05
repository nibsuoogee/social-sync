import { t } from "elysia";

const defaultPermissions = [
  "read:users",
  "create:users",
  "read:data",
  "create:data",
  "write:data",
  "delete:data",
];

export const userModelForRegistration = t.Object({
  username: t.String(),
  email: t.String(),
  password: t.String(),
});
export type UserModelForRegistration = typeof userModelForRegistration.static;

export const userModelForLogin = t.Object({
  email: t.String(),
  password: t.String(),
});
export type UserModelForLogin = typeof userModelForLogin.static;

export const userModel = t.Object({
  id: t.Number(),
  username: t.String(),
  email: t.String(),
  password: t.String(),
  created_at: t.Date(),
});
export type User = typeof userModel.static;
