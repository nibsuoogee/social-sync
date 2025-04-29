import { Elysia } from "elysia";
export declare const syncCalendarRouter: Elysia<"", {
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
    calendar: {
        "sync-all": {
            post: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    200: {
                        message: string;
                        totalUpdated?: undefined;
                        totalAdded?: undefined;
                        totalDeleted?: undefined;
                    } | {
                        message: string;
                        totalUpdated: number;
                        totalAdded: number;
                        totalDeleted: number;
                    };
                    500: "Failed to synchronize calendars";
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
