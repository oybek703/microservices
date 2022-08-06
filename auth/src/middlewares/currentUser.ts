import {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken'

export interface UserPayload {
    email: string
    id: string
}

declare module 'express-serve-static-core' {
    export interface Request {
        currentUser?: UserPayload
    }
}

export default function currentUser(req: Request, res: Response, next: NextFunction) {
    if(!req.session?.jwt) next()
    try {
        req.currentUser = jwt.verify(req.session!.jwt, process.env.JWT_KEY!) as UserPayload
    } catch (e) {console.log(e)}
    next()
}