import Elysia from "elysia";
export declare const inviteRouter: Elysia<"", {
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
    invite: {
        post: {
            body: {
                calendar_id: number;
                email: string;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                400: "You cannot invite yourself";
                401: "No authorized access to calendar";
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
    } & {
        patch: {
            body: {
                id: number;
                status: "accepted" | "declined" | "needs-action";
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                readonly 200: string | {
                    external_source_name?: string | null | undefined;
                    external_source_url?: string | null | undefined;
                    external_last_sync?: Date | null | undefined;
                    external_sync_status?: "inactive" | "active" | "failed" | null | undefined;
                    name: string;
                    id: number;
                    created_at: Date;
                    description: string;
                    color: string;
                    owner_user_id: number;
                    is_group: boolean;
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
    "new-invites": {
        get: {
            body: unknown;
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                readonly 200: {
                    name: string;
                    calendar_id: number;
                    id: number;
                    description: string;
                    members: {
                        username: string;
                        email: string;
                    }[];
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
