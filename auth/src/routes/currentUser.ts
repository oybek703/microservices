import {Request, Response, Router} from 'express'
import {UserPayload} from '../middlewares/currentUser'

const router = Router()

declare module 'express-serve-static-core' {
    export interface Request {
        currentUser?: UserPayload
    }
}

router.get('/api/users/currentUser', (req: Request, res: Response) => {
    res.send({currentUser: req.currentUser || null})
})

export {router as currentUserRoutes}
