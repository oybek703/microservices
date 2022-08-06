import {Router} from 'express'

const router = Router()

router.get('/api/users/signIn', (req, res) => {
    res.send('Answer from signIn route')
})

export {router as signInRoutes}
