import {Request, Response, Router} from 'express'
import Order from '../models/Order'
import {NotAuthorizedError, NotFoundError, OrderStatus} from '@yticketing/common'
import '../types'
import OrderCancelledPublisher from '../events/publishers/orderCancelledPublisher'
import {natsWrapper} from '../natsWrapper'

const router = Router()

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    const {orderId} = req.params
    const order = await Order.findById(orderId).populate('ticket')
    if(!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    order.status = OrderStatus.Cancelled
    await order.save()
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        }
    })
    res.send(order)
})

export {router as deleteOrderRouter}