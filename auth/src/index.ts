import express, {Request, Response} from 'express'

const app = express()

app.use(express.json())

app.get('/api/users/currentUser', (req: Request, res: Response) => {
    res.send('Hi there[current user route]')
})

app.listen(3000, () => {
    console.log('is it working')
    console.log('Auth service is running on port 3000...')
})