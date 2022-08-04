const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(express.json())
app.use(cors())

const posts = {}

function handleEvent(event) {
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
}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/events', (req, res) => {
  const event = req.body
  handleEvent(event)
  res.send('OK')
})

app.listen(4002, async () => {
  console.log('Query service is running on port 4002...')
  const {data} = await axios.get('http://event-bus-srv:4005/events')
  for (const event of data) {
    console.log('Processing event: ', event.type)
    handleEvent(event)
  }
})