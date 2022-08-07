import {Request, Response, Router} from 'express'
import currentUser from '../middlewares/currentUser'

const router = Router()

router.get('/api/users/currentUser', currentUser, (req: Request, res: Response) => {
    res.send({currentUser: req.currentUser || null})
})

export {router as currentUserRoutes}
