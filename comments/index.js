const express = require('express')
const cors = require('cors')
const { randomBytes } = require('crypto')

const app = express()

app.use(express.json())
app.use(cors())

const commentsById = {}

app.post('/posts/:postId/comments', (req, res) => {
    const { content } = req.body
    const id = randomBytes(8).toString('hex')
    const comments = commentsById[req.params.postId] || []
    const newComment = {id, content}
    comments.push(newComment)
    commentsById[req.params.postId] = comments
    res.send(comments)
})

app.get('/posts/:postId/comments', (req, res) => {
    const comments = commentsById[req.params.postId] || []
    res.send(comments)
})

app.listen(
    4001,
    () => console.log('Comments server is listening on port 4000...')
)
