import {Request, Response, Router} from 'express'
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from '@yticketing/common'
import Ticket from '../models/Ticket'
import {body} from 'express-validator'
import {TicketUpdatedPublisher} from '../events/publishers/TicketUpdatedPublisher'
import natsWrapper from '../natsWrapper'

const router = Router()

router.put('/api/tickets/:id',
    [
        body('title').notEmpty().withMessage('Title is required.'),
        body('price').isFloat({min: 0})
            .withMessage('Price should be greater than 0.')
    ],
    validateRequest,
    requireAuth, async (req: Request, res: Response) => {
    const {title, price} = req.body
    const ticket = await Ticket.findById(req.params.id)
    if(!ticket) throw new NotFoundError()
    if(ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    ticket.set({title, price})
    await ticket.save()
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })
    res.send(ticket)
})

export {router as updateTicketRouter}