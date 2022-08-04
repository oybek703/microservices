const express = require('express')
const axios = require('axios')

const app = express()

app.use(express.json())

const events = []

app.post('/events',async (req, res) => {
  const event = req.body
  events.push(event)
  try {
    // send post request posts service
    await axios.post('http://posts-srv:4000/events', event)
    // send post request comments service
    await axios.post('http://comments-srv:4001/events', event)
    try {
      // send post request query service
      await axios.post('http://query-srv:4002/events', event)
    } catch (e) {
      console.log(e.message)
    }
    // send post request moderation service
    await axios.post('http://moderation-srv:4003/events', event)
  } catch (e) {
    console.log(e.message)
  }
  res.send('OK')
})

app.get('/events', (req, res) => {
  res.send(events)
})

app.listen(4005, () => {
  console.log('Event-bus service is running on port 4005...')
})
