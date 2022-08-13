import {Request, Response, Router} from 'express'
import {
    BadRequestError, NotFoundError, OrderStatus,
    requireAuth, validateRequest
} from '@yticketing/common'
import {body} from 'express-validator'
import {Types} from 'mongoose'
import Ticket from '../models/Ticket'
import Order from '../models/Order'
import '../types'
import OrderCreatedPublisher from '../events/publishers/orderCreatedPublisher'
import {natsWrapper} from '../natsWrapper'

const router = Router()

const EXPIRATION_WINDOW_SECONDS: number = 15 * 60

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
        if (!ticket) throw new NotFoundError()
        // Make sure that this ticket is not already reserved
        const isReserved = await ticket.isReserved()
        if (isReserved) throw new BadRequestError('Ticket is already reserved.')
        // Calculate expiration date for this order
        const expiration = new Date()
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
        // Create order and save to database
        const userId = req.currentUser!.id
        const order = Order.build({
            userId,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })
        await order.save()
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: req.currentUser!.id,
            version: 1,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        })
        res.status(201).send(order)
    })

export {router as createOrderRouter}