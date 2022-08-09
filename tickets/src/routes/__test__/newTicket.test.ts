import request from 'supertest'
import app from '../../app'

it(`should have route handler on /api/tickets for post request`,async function () {
    const response = await request(app).post('/api/tickets').send({})
    console.log(response.status)
    expect(response.status).not.toEqual(404)
})

it('should be accessible if the user is signed in', async function () {

})

it('should return an error if invalid title provided', async function () {

})

it('should return an error if invalid price is provided', async function () {

})

it('should create ticket with valid inputs', async function () {

})