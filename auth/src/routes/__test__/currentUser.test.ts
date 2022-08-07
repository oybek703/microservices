import request from 'supertest'
import app from '../../app'

it('should respond with details about the current user', async function () {
    const authResponse = await request(app).post('/api/users/signUp')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(201)
    const cookie = await authResponse.get('Set-Cookie')
    const response = await request(app).get('/api/users/currentUser')
        .set('Cookie', cookie)
        .send().expect(200)
    console.log(response.body)
}) 