import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { protectedRouter } from "./routes/protectedRouter";
import { inviteRouter } from "./routes/inviteRouter";
import { calendarRouter } from "src/routes/calendarRouter";
import { eventRouter } from "./routes/eventRouter";
import { calendarUrlImportRouter } from "./routes/importCalendarRouter";
import { syncCalendarRouter } from "./routes/syncCalendarRouter";
import { membershipsRouter } from "./routes/membershipsRouter";

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .get("/", () => "Hello Elysia")
  .use(protectedRouter)
  .use(inviteRouter)
  .use(calendarRouter)
  .use(eventRouter)
  .use(calendarUrlImportRouter)
  .use(syncCalendarRouter)
  .use(membershipsRouter)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
