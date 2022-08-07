import request from 'supertest'
import app from '../../app'

it('should fail when email does not exist supplied', async function () {
    await request(app).post('/api/users/signIn')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(400)
})

it('should fail when incorrect password supplied', async function () {
    await request(app).post('/api/users/signUp')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(201)
    await request(app).post('/api/users/signIn')
        .send({email: 'test@gmail.com', password: '123456789'})
        .expect(400)
})

it('should respond with cookie with valid credentials', async function () {
    await request(app).post('/api/users/signUp')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(201)
    const response = await request(app).post('/api/users/signIn')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(200)
    expect(response.get('Set-Cookie')).toBeDefined()
}) 