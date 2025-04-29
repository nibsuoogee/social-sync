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
                401: "No authorized access to calendar";
                400: "You cannot invite yourself";
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
                    description: string;
                    owner_user_id: number;
                    is_group: boolean;
                    color: string;
                    id: number;
                    created_at: Date;
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
                    description: string;
                    id: number;
                    calendar_id: number;
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
