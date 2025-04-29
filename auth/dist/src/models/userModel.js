import { t } from "elysia";
import { sql } from "bun";
/**
 * User Data Transfer Object
 */
export const UserDTO = {
    findUserByEmail: async (email) => {
        const result = await sql `SELECT * FROM users WHERE email = ${email}`;
        return result[0];
    },
    createUser: async (user) => {
        const [newUser] = await sql `
      INSERT INTO users ${sql(user)}
      RETURNING *
    `;
        return newUser;
    },
    verifyPassword: async (password, hash) => {
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
export const userModelForLogin = t.Object({
    email: t.String(),
    password: t.String(),
});
export const userModel = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String(),
    password: t.String(),
    created_at: t.Date(),
});
export const accessToken = t.Object({
    access_token: t.String(),
});
