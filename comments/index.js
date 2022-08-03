const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { randomBytes } = require('crypto')

const app = express()

app.use(express.json())
app.use(cors())

const commentsById = {}

app.post('/posts/:postId/comments', async (req, res) => {
    const { content } = req.body
    const id = randomBytes(8).toString('hex')
    const comments = commentsById[req.params.postId] || []
    const newComment = {id, content, status: 'pending'}
    comments.push(newComment)
    commentsById[req.params.postId] = comments
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id, content,
            postId: req.params.postId,
            status: 'pending'
        }
    })
    res.send(comments)
})

app.get('/posts/:postId/comments', (req, res) => {
    const comments = commentsById[req.params.postId] || []
    res.send(comments)
})

app.post('/events', async (req, res) => {
    console.log('Event received: ', req.body.type)
    if(req.body.type === 'CommentModerated') {
        commentsById[req.body.data.postId] = commentsById[req.body.data.postId].map(comment => {
            if(comment.id === req.body.data.id) {
                comment.status = req.body.data.status
            }
            return comment
        })
        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: req.body.data
        })
    }
    res.send({})
})

app.listen(
    4001,
    () => console.log('Comments server is listening on port 4000...')
)
