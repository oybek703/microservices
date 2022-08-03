const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const posts = {}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/events', (req, res) => {
  const event = req.body
  if (event.type === 'PostCreated') {
    posts[event.data.id] = {
      ...event.data,
      comments: []
    }
  }
  if (event.type === 'CommentCreated') {
    posts[event.data.postId].comments.push({
      id: event.data.id,
      content: event.data.content,
      status: event.data.status
    })
  }
  if (event.type === 'CommentUpdated') {
    posts[event.data.postId].comments = posts[event.data.postId].comments.map(comment => {
      if(comment.id === event.data.id) {
        comment.content = event.data.content
        comment.status = event.data.status
      }
      return comment
    })

  }
  res.send('OK')
})

app.listen(4002, () => {
  console.log('Query service is running on port 4002...')
})