import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'

it('should return 404 if ticket not found', async function () {
    const ticketId = new mongoose.Types.ObjectId().toHexString()
    await request(app).get(`/api/tickets/${ticketId}`).expect(404)
})

it('should return ticket if ticket found', async function () {
    const newTicket = {title: 'Test title', price: 100}
    const response = await request(app).post('/api/tickets')
        .set('Cookie', global.signIn()).send(newTicket).expect(201)
    const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`)
    expect(ticketResponse.body.title).toEqual(newTicket.title)
    expect(ticketResponse.body.price).toEqual(newTicket.price)
})