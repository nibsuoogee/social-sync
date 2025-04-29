import Elysia from "elysia";
export declare const protectedRouter: Elysia<"", {
    decorator: {
        jwt_auth: {
            readonly sign: (morePayload: Record<string, string | number> & import("@elysiajs/jwt").JWTPayloadSpec) => Promise<string>;
            readonly verify: (jwt?: string) => Promise<false | (Record<string, string | number> & import("@elysiajs/jwt").JWTPayloadSpec)>;
        };
    };
    store: {};
    derive: {};
    resolve: {};
}, {
    error: {};
    typebox: import("@sinclair/typebox").TModule<{}, {}>;
}, {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
}, {
    me: {
        get: {
            body: unknown;
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                200: {
                    username: any;
                };
                401: "Not Authorized";
                404: "User not found";
            };
        };
    };
}, {
    derive: {};
    resolve: {};
    schema: {};
}, {
    derive: {
        user: any;
    };
    resolve: {};
    schema: {};
}>;
