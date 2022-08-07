import request from 'supertest'
import app from '../../app'

it('should clear after successfully sign out', async function () {
    await request(app).post('/api/users/signUp')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(201)
    await request(app).post('/api/users/signIn')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(200)
    const response = await request(app).post('/api/users/signOut')
        .send({}).expect(200)
    expect(response.get('Set-Cookie')[0])
        .toBe('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})