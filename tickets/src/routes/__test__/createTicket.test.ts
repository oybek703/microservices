import request from 'supertest'
import app from '../../app'
import Ticket from '../../models/Ticket'
import {natsWrapper} from '../../natsWrapper'

it(`should have route handler on /api/tickets for post request`, async function () {
    const response = await request(app).post('/api/tickets').send({})
    expect(response.status).not.toEqual(404)
})

it('should be accessible if the user is signed in', async function () {
    await request(app).post('/api/tickets').send({}).expect(401)
})

it('should return other than 401 if user signed in', async function () {
    const response = await request(app).post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({})
    expect(response.status).not.toEqual(401)
})

it('should return an error if invalid title provided', async function () {
    await request(app).post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({
            title: '',
            price: 10
        }).expect(400)
    await request(app).post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({
            price: 10
        }).expect(400)
})

it('should return an error if invalid price is provided', async function () {
    await request(app).post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({title: 'test', price: -10})
        .expect(400)
    await request(app).post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({title: 'test1'}).expect(400)
})

it('should create ticket with valid inputs', async function () {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)
    const newTicket = {title: 'Test title', price: 10}
    await request(app).post('/api/tickets')
        .set('Cookie', global.signIn())
        .send(newTicket).expect(201)
    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].title).toEqual(newTicket.title)
    expect(tickets[0].price).toEqual(newTicket.price)
})

it('should publish an event', async function () {
    await request(app).post('/api/tickets')
        .set('Cookie', global.signIn())
        .send({
            title: 'test',
            price: 10
        }).expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})