import {Request, Response, Router} from 'express'
import {requireAuth, validateRequest} from '@yticketing/common'
import {body} from 'express-validator'
import Ticket from '../models/Ticket'
import '../types'

const router = Router()

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
        const ticket = new Ticket({title, price, userId: req.currentUser!.id})
        await ticket.save()
        res.status(201).send(ticket)
    })

export {router as createTicketRouter}