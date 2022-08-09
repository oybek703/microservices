import request from 'supertest'
import app from '../../app'

async function createTickets(count: number = 2) {
    return Promise.all(Array(count)
        .fill('')
        .map(_ => request(app)
            .post('/api/tickets')
            .set('Cookie', global.signIn())
            .send({title: 'test', price: 10})
        )
    )
}

it('should return list of tickets', async function () {
    await createTickets(10)
    const response = await request(app).get('/api/tickets')
    expect(response.body.length).toEqual(10)
})