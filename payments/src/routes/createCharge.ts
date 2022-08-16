import {Router, Request, Response} from 'express'
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest
} from '@yticketing/common'
import {body} from 'express-validator'
import Order from '../models/Order'
import '../types'
import stripe from '../stripe'
import Payment from '../models/Payment'
import PaymentCreatedPublisher from '../events/publishers/paymentCreatedPublisher'
import {natsWrapper} from '../natsWrapper'

const router = Router()

router.post('/api/payments',
    requireAuth,
    [
        body('token').notEmpty(),
        body('orderId').notEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {token, orderId} = req.body
        const order = await Order.findById(orderId)
        if (!order) throw new NotFoundError()
        if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
        if (order.status === OrderStatus.Cancelled)
            throw new BadRequestError('Cannot pay for cancelled order!')
        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            source: token
        })
        const payment = await Payment.build({
            orderId: orderId,
            stripeId: charge.id
        }).save()
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })
        res.status(201).send({id: payment.id})
    })

export {router as createChargeRouter}