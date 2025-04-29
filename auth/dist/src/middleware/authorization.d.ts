export declare const authorizationMiddleware: ({ headers, jwt_auth, }: {
    headers: any;
    jwt_auth: any;
}) => Promise<{
    user: any;
}>;
