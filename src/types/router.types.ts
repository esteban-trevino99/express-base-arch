export interface Route {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    handler: string;
    options: {
        authRequired: boolean,
        bodyRequired: any
    }
}
