import { Elysia } from "elysia";
export declare const eventRouter: Elysia<"", {
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
    event: {
        post: {
            body: {
                ics_uid?: string | undefined;
                timezone?: string | undefined;
                all_day?: boolean | undefined;
                status?: "confirmed" | "tentative" | "cancelled" | undefined;
                description: string;
                title: string;
                location: string;
                start_time: Date;
                end_time: Date;
                recurrence_rule: string;
                calendar_id: number;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                readonly 200: {
                    event: {
                        description: string;
                        id: number;
                        created_at: Date;
                        ics_uid: string;
                        title: string;
                        location: string;
                        start_time: Date;
                        end_time: Date;
                        timezone: string;
                        all_day: boolean;
                        recurrence_rule: string;
                        status: "confirmed" | "tentative" | "cancelled";
                        updated_at: Date;
                        proposed_by_user_id: number;
                        user_read_only: boolean;
                    };
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
    } & {
        patch: {
            body: {
                description?: string | undefined;
                title?: string | undefined;
                location?: string | undefined;
                start_time?: Date | undefined;
                end_time?: Date | undefined;
                timezone?: string | undefined;
                all_day?: boolean | undefined;
                recurrence_rule?: string | undefined;
                status?: "confirmed" | "tentative" | "cancelled" | undefined;
                id: number;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                401: "No authorized access to event";
                readonly 200: {
                    description: string;
                    id: number;
                    created_at: Date;
                    ics_uid: string;
                    title: string;
                    location: string;
                    start_time: Date;
                    end_time: Date;
                    timezone: string;
                    all_day: boolean;
                    recurrence_rule: string;
                    status: "confirmed" | "tentative" | "cancelled";
                    updated_at: Date;
                    proposed_by_user_id: number;
                    user_read_only: boolean;
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
    } & {
        ":id": {
            delete: {
                body: unknown;
                params: {
                    id: number;
                };
                query: unknown;
                headers: unknown;
                response: {
                    500: string;
                    401: "No authorized access to event";
                    404: "Event not found.";
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
