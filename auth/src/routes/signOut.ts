import {Request, Response, Router} from 'express'

const router = Router()

router.post('/api/users/signOut', (req: Request, res: Response) => {
    req.session = null
    res.send({success: true})
})

export {router as signOutRoutes}
