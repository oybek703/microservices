export interface UserPayload {
    email: string
    id: string
}

declare module 'express-serve-static-core' {
    export interface Request {
        currentUser?: UserPayload
    }
}
