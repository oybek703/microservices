import request from 'supertest'
import app from '../../app'
import {Types} from 'mongoose'
import Order from '../../models/Order'
import {OrderStatus} from '@yticketing/common'

it('should return 404 if order does not exist', async function () {
    await request(app).post('/api/payments')
        .set('Cookie', global.signIn())
        .send({
            token: 'test_stripe_token',
            orderId: new Types.ObjectId().toHexString()
        }).expect(404)
})

it('should return 401 if user is not order owner', async function () {
    const order = await Order.build({
        id: new Types.ObjectId().toHexString(),
        price: 10,
        version: 0,
        status: OrderStatus.Created,
        userId: new Types.ObjectId().toHexString()
    }).save()
    await request(app).post('/api/payments')
        .set('Cookie', global.signIn())
        .send({
            token: 'test_stripe_token',
            orderId: order.id
        }).expect(401)
})

it('should return 400 if purchasing order is cancelled', async function () {
    const userId = new Types.ObjectId().toHexString()
    const order = await Order.build({
        id: new Types.ObjectId().toHexString(),
        price: 10,
        version: 0,
        status: OrderStatus.Cancelled,
        userId
    }).save()
    await request(app).post('/api/payments')
        .set('Cookie', global.signIn(userId))
        .send({
            token: 'test_stripe_token',
            orderId: order.id
        }).expect(400)
}) 