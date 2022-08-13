import request from 'supertest'
import Ticket from '../../models/Ticket'
import app from '../../app'
import {OrderStatus} from '@yticketing/common'

it('should change order status to cancelled', async function () {
    const ticket = await Ticket.build({price: 10, title: 'Test ticket title'}).save()
    const user = global.signIn()
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user).send({ticketId: ticket.id}).expect(201)
    const {body: fetchedOrder} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
    expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled)
})

it.todo('emits an event order cancelled')