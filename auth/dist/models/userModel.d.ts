/**
 * User Data Transfer Object
 */
export declare const UserDTO: {
    findUserByEmail: (email: string) => Promise<User>;
    createUser: (user: UserModelForRegistration) => Promise<User>;
    verifyPassword: (password: string, hash: string) => Promise<boolean>;
};
export declare const userModelForRegistration: import("@sinclair/typebox").TObject<{
    username: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
    password: import("@sinclair/typebox").TString;
}>;
export type UserModelForRegistration = typeof userModelForRegistration.static;
export declare const userModelForLogin: import("@sinclair/typebox").TObject<{
    email: import("@sinclair/typebox").TString;
    password: import("@sinclair/typebox").TString;
}>;
export type UserModelForLogin = typeof userModelForLogin.static;
export declare const userModel: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TNumber;
    username: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
    password: import("@sinclair/typebox").TString;
    created_at: import("@sinclair/typebox").TDate;
}>;
export type User = typeof userModel.static;
export declare const accessToken: import("@sinclair/typebox").TObject<{
    access_token: import("@sinclair/typebox").TString;
}>;
export type AccessToken = typeof accessToken.static;
