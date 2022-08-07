import NotAuthorizedError from '../errors/notAuthorizedError'
import {NextFunction, Request, Response} from 'express'

export default function requireAuth(req: Request, res: Response, next: NextFunction) {
    if(!req.currentUser) throw new NotAuthorizedError()
    next()
}