import { t } from "elysia";
import { sql } from "bun";

/**
 * User Data Transfer Object
 */
export const UserDTO = {
  findUserByEmail: async (email: string): Promise<User> => {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result[0];
  },
  createUser: async (user: UserModelForRegistration): Promise<User> => {
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
