import { t } from "elysia";
import { sql } from "bun";

const defaultPermissions = [
  "read:users",
  "create:users",
  "read:data",
  "create:data",
  "write:data",
  "delete:data",
];

/**
 * User Data Transfer Object
 */
export const UserDTO = {
  findUserByEmail: async (email: string) => {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result[0] ?? null;
  },
  createUser: async (user: UserModelForSignup) => {
    const [newUser] = await sql`
      INSERT INTO users ${sql(user)}
      RETURNING *
    `;

    return newUser;
  },
  verifyPassword: async (password: string, hash: string) => {
    return await Bun.password.verify(password, hash);
  },
};

export const userModelForSignup = t.Object({
  username: t.String(),
  email: t.String(),
  password: t.String(),
});
export type UserModelForSignup = typeof userModelForSignup.static;

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
