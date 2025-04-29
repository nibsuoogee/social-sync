import Elysia from "elysia";
export declare const calendarRouter: Elysia<"", {
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
        post: {
            body: {
                external_source_name?: string | null | undefined;
                external_source_url?: string | null | undefined;
                external_last_sync?: Date | null | undefined;
                external_sync_status?: "inactive" | "active" | "failed" | null | undefined;
                name: string;
                description: string;
                is_group: boolean;
                color: string;
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
                        description: string;
                        owner_user_id: number;
                        is_group: boolean;
                        color: string;
                        id: number;
                        created_at: Date;
                    };
                    membership: {
                        color: string;
                        id: number;
                        calendar_id: number;
                        user_id: number;
                        role: "owner" | "member";
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
        ":id": {
            get: {
                body: unknown;
                params: {
                    id: number;
                };
                query: unknown;
                headers: unknown;
                response: {
                    500: string;
                    401: "No authorized access to calendar";
                    readonly 200: {
                        mainCalendar: {
                            calendar: {
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
                            events: {
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
                            }[];
                        }[];
                        personalCalendars: {
                            calendar: {
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
                            events: {
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
                            }[];
                        }[];
                        groupMemberCalendars: {
                            calendar: {
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
                            events: {
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
                            }[];
                        }[];
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
    } & {
        all: {
            get: {
                body: unknown;
                params: {};
                query: unknown;
                headers: unknown;
                response: {
                    500: string;
                    readonly 200: {
                        mainCalendar: {
                            calendar: {
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
                            events: {
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
                            }[];
                        }[];
                        personalCalendars: {
                            calendar: {
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
                            events: {
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
                            }[];
                        }[];
                        groupMemberCalendars: {
                            calendar: {
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
                            events: {
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
                            }[];
                        }[];
                    };
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
    } & {
        group: {
            ":id": {
                get: {
                    body: unknown;
                    params: {
                        id: number;
                    };
                    query: unknown;
                    headers: unknown;
                    response: {
                        500: string;
                        401: "No authorized access to calendar";
                        readonly 200: {
                            mainCalendar: {
                                calendar: {
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
                                events: {
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
                                }[];
                            }[];
                            personalCalendars: {
                                calendar: {
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
                                events: {
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
                                }[];
                            }[];
                            groupMemberCalendars: {
                                calendar: {
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
                                events: {
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
                                }[];
                            }[];
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
    } & {
        patch: {
            body: {
                name?: string | undefined;
                description?: string | undefined;
                color?: string | undefined;
                external_source_name?: string | null | undefined;
                external_source_url?: string | null | undefined;
                id: number;
            };
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                401: "No authorized access to calendar";
                readonly 200: {
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
                    401: "No authorized access to calendar";
                    404: "Calendar not found.";
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
    calendars: {
        get: {
            body: unknown;
            params: {};
            query: unknown;
            headers: unknown;
            response: {
                500: string;
                readonly 200: {
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
