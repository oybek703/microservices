import {Request, Response, Router} from 'express'
import {requireAuth, validateRequest} from '@yticketing/common'
import {body} from 'express-validator'
import Ticket from '../models/Ticket'
import '../types'
import {TicketCreatedPublisher} from '../events/publishers/TicketCreatedPublisher'
import natsWrapper from '../natsWrapper'

const router = Router()

console.log(Object.keys(natsWrapper))

router.post('/api/tickets',
    requireAuth,
    [
        body('title').notEmpty().withMessage('Title is required.'),
        body('price').isFloat({min: 0})
            .withMessage('Price should be greater than 0.')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {title, price} = req.body
        const userId = req.currentUser!.id
        const ticket = new Ticket({title, price, userId})
        await ticket.save()
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title, price
        })
        res.status(201).send(ticket)
    })

export {router as createTicketRouter}