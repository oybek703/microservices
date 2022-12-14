import {Request, Response, Router} from 'express'
import {body} from 'express-validator'
import User from '../models/User'
import Password from '../services/password'
import {sign} from 'jsonwebtoken'
import {BadRequestError, validateRequest} from '@yticketing/common'

const router = Router()

router.post('/api/users/signIn',
    [
        body('email').isEmail().withMessage('Email must be valid email address.'),
        body('password').trim().notEmpty().withMessage('You must supply a password.')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) throw new BadRequestError('Invalid credentials.')
        const matchPassword = await Password.compare(user.password, password)
        if (!matchPassword) throw new BadRequestError('Invalid credentials.')
        const userJwt = sign({id: user.id, email: user.email}, process.env.JWT_KEY!)
        req.session = {jwt: userJwt}
        res.status(200).send(user)
    })

export {router as signInRoutes}
