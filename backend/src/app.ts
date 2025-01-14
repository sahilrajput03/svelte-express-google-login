import express from 'express'
import type { Application, Request, Response } from 'express'

const app: Application = express()

const port = 3001

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from express + typescript')
})

app.listen(port, function () {
  console.log(`App is listening on port ${port}`)
})
