import express from 'express'
import mongoose from "mongoose"
// import mockTasks from './data/mock.js'
import Task from './models/Task.js'
import { DATABASE_URL } from "./env.js"

const app = express()
app.use(express.json())

const asyncHandler = (handle) => {
  return async (req, res) => {
    try {
      await handle(req, res)
    } catch (error) {
      if (error.name === 'ValidatoinError') {
        res.status(400).send({ message: error.message })
      } else {
        res.status(500).send({ message: error.message })
      }
    }
  }
}

app.get('/tasks', asyncHandler(async (req, res) => {
  // const
}))

await mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'))

app.get('/tasks', async (req, res) => {
  const sort = req.query.sort
  const count = Number(req.query.count)

  const sortOption = {
    createdAt: sort === 'oldest' ? 'asc' : 'desc',
  }

  const tasks = await Task.find().sort(sortOption).limit(count)

  res.send(tasks)

  // const compareFn = sort === 'oldest' ? (a, b) => a.createdAt - b.createdAt : (a, b) => b.createdAt - a.createdAt
  // let sortedTasks = mockTasks.sort(compareFn)

  // if (count) {
  // sortedTasks = sortedTasks.slice(0, count)
  // }

  // res.send(sortedTasks)
})

app.post('/tasks', (req, res) => {
  const newTask = req.body

  const ids = mockTasks.map((task) => task.id)
  newTask.id = Math.max(...ids) + 1
  newTask.isComplete = false
  newTask.createdAt = new Date()
  newTask.updatedAt = new Date()

  mockTasks.push(newTask)

  res.status(201).send(newTask)
})

// app.patch('/tasks/:id', (req, res) => {
//   const taskId = Number(req.params.id)
//   const task = mockTasks.find((task) => task.id === taskId)

//   if (task) {
//     Object.keys(req.body).forEach((keyName) => {
//       task[keyName] = req.body[keyName]
//     })
//     task.updatedAt = new Date()
//     res.send(task)
//   } else {
//     res.status(404).send(`Cann't find task by given id`)
//   }
// })

app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await Task.findByIdAndDelete(taskId)

  if (task) {
    res.sendStatus(204)
  } else {
    res.status(404).send(`Cann't find task by given id`)
  }
})

app.listen(process.env.PORT || 3000, () => console.log(`Server Started!`))