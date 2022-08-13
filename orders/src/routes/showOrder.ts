import {Request, Response, Router} from 'express'
import Order from '../models/Order'
import {NotAuthorizedError, NotFoundError} from '@yticketing/common'
import '../types'

const router = Router()

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
    const {orderId} = req.params
    const order = await Order.findById(orderId)
    if(!order) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    res.send(order)
})

export {router as showOrderRouter}