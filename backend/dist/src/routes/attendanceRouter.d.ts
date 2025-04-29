import Elysia from "elysia";
export declare const attendanceRouter: Elysia<"", {
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
    attendances: {
        ":event_id": {
            get: {
                body: unknown;
                params: {
                    event_id: number;
                };
                query: unknown;
                headers: unknown;
                response: {
                    500: string;
                    401: "No authorized access to attendances";
                    readonly 200: {
                        color: string;
                        status: "tentative" | "accepted" | "declined" | "needs-action";
                        user_id: number;
                        role: "owner" | "member";
                        username: string;
                        membership_id: number;
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
    };
    attendance: {
        patch: {
            body: {
                status: "tentative" | "accepted" | "declined" | "needs-action";
                event_id: number;
                membership_id: number;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                401: "No authorized access to membership";
                readonly 200: string;
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
