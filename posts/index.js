const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { randomBytes } = require('crypto')

const app = express()

app.use(express.json())
app.use(cors())

const posts = {}

app.post('/posts', async (req, res) => {
    const { title } = req.body
    const id = randomBytes(4).toString('hex')
    const newPost = { id, title }
    posts[id] = newPost
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {id, title}
    })
    res.send(newPost)
})
app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    console.log('Event received: ', req.body.type)
    res.send({})
})

app.listen(
    4000,
    () => console.log('Posts server is listening on port 4000...')
)
