import {Request, Response, Router} from 'express'
import Order from '../models/Order'
import {NotAuthorizedError, NotFoundError, OrderStatus} from '@yticketing/common'
import '../types'

const router = Router()

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    const {orderId} = req.params
    const order = await Order.findById(orderId)
    if(!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    order.status = OrderStatus.Cancelled
    await order.save()
    // publish event that the order was cancelled
    res.send(order)
})

export {router as deleteOrderRouter}