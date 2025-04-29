import { Elysia } from "elysia";
export declare const calendarUrlImportRouter: Elysia<"", {
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
    import: {
        post: {
            body: {
                external_source_name?: string | null | undefined;
                external_source_url?: string | null | undefined;
                external_last_sync?: Date | null | undefined;
                external_sync_status?: "inactive" | "active" | "failed" | null | undefined;
                name: string;
                description: string;
                color: string;
                is_group: boolean;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                readonly 200: {
                    calendar: {
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
                    membership: {
                        calendar_id: number;
                        user_id: number;
                        id: number;
                        role: "owner" | "member";
                        color: string;
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
