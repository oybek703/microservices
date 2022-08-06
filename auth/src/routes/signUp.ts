import {Request, Response, Router} from 'express'
import {body, validationResult} from 'express-validator'
import RequestValidationError from '../errors/requestValidationError'
import User, {IUser} from '../models/User'
import {HydratedDocument} from 'mongoose'

const router = Router()

router.post('/api/users/signUp', [
    body('email').isEmail().withMessage('Email must be valid email address.'),
    body('password').trim().isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters.')
], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
        // res.status(400).send(errors.array())
    }
    const {email, password} = req.body
    const existingUser = await User.findOne({email})
    if(existingUser) {
        res.status(400).send('EMAIL IN USE')
        return
    }
    const newUser: HydratedDocument<IUser> = new User({email, password})
    await newUser.save()
    res.send(newUser)
})

export {router as signUpRoutes}
