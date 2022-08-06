import {Router} from 'express'

const router = Router()

router.get('/api/users/signOut', (req, res) => {
    res.send('Answer from signOut route')
})

export {router as signOutRoutes}
