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
    return result.rows[0];
  },
  createUser: async (user: UserModelForSignup) => {
    /*const newUser: User = {
      ...user,
      id: users.length + 1,
      password: await Bun.password.hash(user.password),
      permissions: defaultPermissions,
    };*/

    const result =
      await sql`INSERT INTO users (username, email, password) VALUES (${user.username}, ${user.email}, ${user.password}, ${Date.UTC}) RETURNING *`;

    //users.push(newUser);

    return newUser;
  },
  verifyPassword: async (password: string, hash: string) => {
    return await Bun.password.verify(password, hash);
  },
};

export const userModelForSignup = t.Object({
  email: t.String(),
  password: t.String(),
});

export type UserModelForSignup = typeof userModelForSignup.static;

export type User = typeof userModel.static;

export const userModel = t.Object({
  id: t.Number(),
  username: t.String(),
  email: t.String(),
  password: t.String(),
});
