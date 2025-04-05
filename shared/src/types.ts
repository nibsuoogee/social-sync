import { t } from "elysia";

export const jwtObject = t.Object({
  id: t.Integer(),
  //permissions: string;
});

export type JwtObject = typeof jwtObject.static;
