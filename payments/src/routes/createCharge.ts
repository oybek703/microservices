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
        if(order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
        if(order.status === OrderStatus.Cancelled)
            throw new BadRequestError('Cannot pay for cancelled order!')
        res.send({success: true})
    })

export {router as createChargeRouter}