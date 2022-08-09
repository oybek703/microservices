import {MongoMemoryServer} from 'mongodb-memory-server'
import {connect, connection} from 'mongoose'
import request from 'supertest'
import app from '../app'

jest.setTimeout(100000)

declare global {
    function signIn(): Promise<string[]>
}

let mongo: MongoMemoryServer

beforeAll(async function () {
    process.env.JWT_KEY='test_key'
    mongo = await MongoMemoryServer.create()
    const mongoUri = await mongo.getUri()
    await connect(mongoUri)
})

beforeEach(async function () {
    const collections = await connection.db.collections()
    for (const collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async function () {
    await mongo.stop()
    await connection.close()
})

global.signIn = async function () {
    const authResponse = await request(app).post('/api/users/signUp')
        .send({email: 'test@gmail.com', password: '123456'})
        .expect(201)
    return authResponse.get('Set-Cookie')
}