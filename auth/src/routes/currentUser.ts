import {Router} from 'express'

const router = Router()

router.get('/api/users/currentUser', (req, res) => {
    res.send('Answer from currentUser route')
})

export {router as currentUserRoutes}
