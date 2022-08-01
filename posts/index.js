const express = require('express')
const { randomBytes } = require('crypto')

const app = express()

app.use(express.json())

const posts = {}

app.post('/posts', (req, res) => {
    const { title } = req.body
    const id = randomBytes(4).toString('hex')
    const newPost = { id, title }
    posts[id] = newPost
    res.send(newPost)
})
app.get('/posts', (req, res) => {
    res.send(posts)
})

app.listen(
    4000,
    () => console.log('Posts server is listening on port 4000...')
)
