import {Request, Response, Router} from 'express'
import {requireAuth, validateRequest} from '@yticketing/common'
import {body} from 'express-validator'
import {Types} from 'mongoose'

const router = Router()

router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId')
            .notEmpty()
            .custom((input: string) => Types.ObjectId.isValid(input))
            .withMessage('Ticket id must be provided.')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        res.send({})
    })

export {router as createOrderRouter}