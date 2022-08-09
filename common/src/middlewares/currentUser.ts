import {NextFunction, Request, Response} from 'express'
import {verify} from 'jsonwebtoken'
import {UserPayload} from '../types'


export function currentUser(req: Request, res: Response, next: NextFunction) {
    if(!req.session?.jwt) {
        next()
        return
    }
    req.currentUser = verify(req.session!.jwt, process.env.JWT_KEY!) as UserPayload
    next()
}