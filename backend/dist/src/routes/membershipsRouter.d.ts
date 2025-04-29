import Elysia from "elysia";
export declare const membershipsRouter: Elysia<"", {
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
    memberships: {
        ":calendar_id": {
            get: {
                body: unknown;
                params: {
                    calendar_id: number;
                };
                query: unknown;
                headers: unknown;
                response: {
                    500: string;
                    401: "No authorized access to calendar";
                    readonly 200: {
                        color: string;
                        id: number;
                        calendar_id: number;
                        user_id: number;
                        role: "owner" | "member";
                        username: string;
                        email: string;
                    }[];
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    } & {
        ":calendar_id": {
            delete: {
                body: unknown;
                params: {
                    calendar_id: number;
                };
                query: unknown;
                headers: unknown;
                response: {
                    500: string;
                    readonly 200: string;
                    readonly 400: string;
                    readonly 401: string;
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
            };
        };
    };
    membership: {
        color: {
            patch: {
                body: {
                    color: string;
                    calendar_id: number;
                };
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    500: string;
                    401: "No authorized access to membership";
                    readonly 200: {
                        color: string;
                        id: number;
                        calendar_id: number;
                        user_id: number;
                        role: "owner" | "member";
                    };
                    422: {
                        type: "validation";
                        on: string;
                        summary?: string;
                        message?: string;
                        found?: unknown;
                        property?: string;
                        expected?: string;
                    };
                };
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
