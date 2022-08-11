import {Request, Response, Router} from 'express'
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from '@yticketing/common'
import {body} from 'express-validator'
import {Types} from 'mongoose'
import Ticket from '../models/Ticket'
import Order from '../models/Order'

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
        const {ticketId} = req.body
        // Find the order user trying to create in database
        const ticket = await Ticket.findById(ticketId)
        if(!ticket) throw new NotFoundError()
        // Make sure that this ticket is not already reserved
        const isReserved = await ticket.isReserved()
        if(isReserved) throw new BadRequestError('Ticket is already reserved.')
        // Calculate expiration date for this order
        // Create order and save to database
        // Publish an event that order was created
        res.send({})
    })

export {router as createOrderRouter}