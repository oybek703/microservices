import {Router, Request, Response} from 'express'
import {body, validationResult} from 'express-validator'
import RequestValidationError from '../errors/requestValidationError'
import DatabaseConnectionError from '../errors/databaseConnectionError'

const router = Router()

router.post('/api/users/signUp', [
    body('email').isEmail().withMessage('Email must be valid email address.'),
    body('password').trim().isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters.')
], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
        // res.status(400).send(errors.array())
    }
    throw new DatabaseConnectionError()
    res.send('Answer from signUp route')
})

export {router as signUpRoutes}
