import {Request, Response, Router} from 'express'
import {requireAuth} from '@yticketing/common'
import Order from '../models/Order'
import '../types'

const router = Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({userId: req.currentUser!.id})
        .populate('ticket')
    res.send(orders)
})

export {router as getOrdersRouter}