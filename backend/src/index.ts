import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { protectedRouter } from "./routes/protectedRouter";
import { groupRouter } from "./routes/groupRouter";
import { calendarRouter } from "src/routes/calendarRouter";

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .get("/", () => "Hello Elysia")
  .use(protectedRouter)
  .use(groupRouter)
  .use(calendarRouter)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
