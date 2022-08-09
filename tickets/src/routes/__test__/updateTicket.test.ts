import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'

it('should return 404 if ticket does not exist', async function () {
    const ticketId = new mongoose.Types.ObjectId().toHexString()
    await request(app).put(`/api/tickets/${ticketId}`)
        .set('Cookie', global.signIn())
        .send({title: 'Test', price: 1})
        .expect(404)
})

it('should return 401 if user is not authenticated', async function () {
    const ticketId = new mongoose.Types.ObjectId().toHexString()
    await request(app).put(`/api/tickets/${ticketId}`)
        .send({title: 'Test', price: 1})
        .expect(401)
})

it('should return 401 if user does not own the ticket', async function () {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({title: 'Test', price: 1})
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signIn()).send({title: 'Test 1', price: 2})
        .expect(401)
})

it('should return 400 if user provides invalid title or price', async function () {
    const cookie = global.signIn()
    const response = await request(app).post('/api/tickets')
        .set('Cookie', cookie)
        .send({title: 'Test', price: 1})
    await request(app).put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie).send({title: '', price: 10})
        .expect(400)
    await request(app).put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie).send({title: 'Test', price: -19})
        .expect(400)
})

it('should update ticket if valid title and price provided', async function () {
    const cookie = global.signIn()
    const newTicket = {title: 'Ticket 1', price: 10}
    const newTicketValues = {title: 'Ticket 2', price: 15}
    const response = await request(app).post('/api/tickets')
        .set('Cookie', cookie).send(newTicket)
    const updatedTicket = await request(app).put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie).send(newTicketValues)
    expect(updatedTicket.body.title).toEqual(newTicketValues.title)
    expect(updatedTicket.body.price).toEqual(newTicketValues.price)
})