export interface User {
    id: number,
    name: string,
    lastname: string,
    email: string,
    role: string,
    permissions?: string[],
    iat: any
}