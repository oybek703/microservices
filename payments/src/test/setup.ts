import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import {connect, connection} from 'mongoose'
import {sign} from 'jsonwebtoken'

jest.setTimeout(100000)

jest.mock('../natsWrapper')

declare global {
    function signIn(id?: string): string
}

let mongo: MongoMemoryServer

jest.mock('../natsWrapper')

beforeAll(async function () {
    process.env.JWT_KEY='test_key'
    mongo = await MongoMemoryServer.create()
    const mongoUri = await mongo.getUri()
    await connect(mongoUri)
})

beforeEach(async function () {
    jest.clearAllMocks()
    const collections = await connection.db.collections()
    for (const collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async function () {
    await mongo.stop()
    await connection.close()
})

global.signIn = function (id?: string) {
    // Build JWT payload
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@gmail.com'
    }
    // Create JWT
    const jwt = sign(payload, process.env.JWT_KEY!)
    // Build session object
    const session = {jwt}
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session)
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')
    // Return string cookie with encoded data
    return `session=${base64}`
}