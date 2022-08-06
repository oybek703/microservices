import {Request, Response, Router} from 'express'
import {body} from 'express-validator'
import User, {IUser} from '../models/User'
import {HydratedDocument} from 'mongoose'
import jwt from 'jsonwebtoken'
import BadRequestError from '../errors/badRequestError'
import validateRequest from '../middlewares/validateRequest'

const router = Router()

router. post('/api/users/signUp', [
    body('email').isEmail().withMessage('Email must be valid email address.'),
    body('password').trim().isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters.')
], validateRequest, async (req: Request, res: Response) => {
    const {email, password} = req.body
    const existingUser = await User.findOne({email})
    if (existingUser) throw new BadRequestError('Email already exists.')
    const newUser: HydratedDocument<IUser> = new User({email, password})
    await newUser.save()
    const userJwt = jwt.sign({id: newUser.id, email: newUser.email}, process.env.JWT_KEY!)
    req.session = {jwt: userJwt}
    res.status(201).send(newUser)
})

export {router as signUpRoutes}
