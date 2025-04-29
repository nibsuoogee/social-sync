import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { registerRouter } from "./routes/registerRouter";
import { loginRouter } from "./routes/loginRouter";
import { register } from "./metrics";

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .get("/metrics", async () => {
    return new Response(await register.metrics(), {
        headers: {
            "Content-Type": register.contentType
        }
    });
  })
  .get("/", () => "Hello fom auth!")
  .use(registerRouter)
  .use(loginRouter)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
