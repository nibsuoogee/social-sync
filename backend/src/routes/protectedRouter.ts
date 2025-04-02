import Elysia from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { sql } from "bun";

export const protectedRouter = new Elysia()
  .use(jwtConfig)
  .derive(authorizationMiddleware)
  .guard(
    {
      beforeHandle: ({ user, error }) => {
        // 1. Check if the user is authenticated
        //    If not, return a 401 error
        console.log("user", user);
        if (!user) return error(401, "Not Authorized");
      },
    },
    (app) =>
      app.get("/me", async ({ user, error }) => {
        // 1. Check if the user object is present, indicating an authenticated user
        //    If the user is not authenticated (user is null or undefined), return a 401 error
        if (!user) return error(401, "Not Authorized");

        const [row] =
          await sql`SELECT username FROM users WHERE id = ${user.id}`;

        if (!row) return error(404, "User not found");

        return { username: row.username };
      })
  );
