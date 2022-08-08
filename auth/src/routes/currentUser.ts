import {Request, Response, Router} from 'express'
import {currentUser} from '@yticketing/common'

const router = Router()

interface UserPayload {
    email: string
    id: string
}

declare module 'express-serve-static-core' {
    export interface Request {
        currentUser?: UserPayload
    }
}

router.get('/api/users/currentUser', currentUser, (req: Request, res: Response) => {
    res.send({currentUser: req.currentUser || null})
})

export {router as currentUserRoutes}
