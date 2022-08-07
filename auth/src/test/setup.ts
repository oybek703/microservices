import {MongoMemoryServer} from 'mongodb-memory-server'
import {connect, connection} from 'mongoose'

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