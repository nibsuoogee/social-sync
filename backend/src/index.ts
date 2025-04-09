import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { protectedRouter } from "./routes/protectedRouter";
import { inviteRouter } from "./routes/inviteRouter";
import { calendarRouter } from "src/routes/calendarRouter";
import { eventRouter } from "./routes/eventRouter";

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .get("/", () => "Hello Elysia")
  .use(protectedRouter)
  .use(inviteRouter)
  .use(calendarRouter)
  .use(eventRouter)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
