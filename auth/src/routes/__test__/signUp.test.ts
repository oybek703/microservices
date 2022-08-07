import request from 'supertest'
import app from '../../app'

it('should return 201 on successful sign up', async function () {
    await request(app).post('/api/users/signUp').send({
        email: 'test@gmail.com',
        password: '123456'
    }).expect(201)
})

it('should return 400 in bad credentials', async function () {
    await request(app).post('/api/users/signUp').send({
        email: 'test.com',
        password: '123456'
    }).expect(400)
    await request(app).post('/api/users/signUp').send({
        email: 'test@gmail.com',
        password: '1'
    }).expect(400)
})

it('should return 400 with missing credentials',  async function () {
    await request(app).post('/api/users/signUp')
        .send({}).expect(400)
})

it('should disallow duplicate emails', async function () {
    await request(app).post('/api/users/signUp')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(201)
    await request(app).post('/api/users/signUp')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(400)
})

it('should set cookie after successfull sign up', async function () {
    const response = await request(app).post('/api/users/signUp')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined()
}) 