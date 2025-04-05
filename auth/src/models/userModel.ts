import { User, UserModelForRegistration } from "@shared/index";
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
