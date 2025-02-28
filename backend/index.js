require('dotenv').config()
const { info } = require('./utils/logger')
const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => { 
    console.error(error.message)

    if (error.name === 'CastError') { 
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}
app.use(errorHandler)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        if(note) { 
            response.json(note)
        } else { 
            response.status(404).end()
        }
    }).catch(error => next(error))

})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if(!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content, 
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.put('/api/notes/:id', (request, response, next) => { 
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id,  note, { new: true}).then(
        updatedNote => { 
            response.json(updatedNote)
        }
    ).catch(error => next(error))
})

const PORT = config.PORT
app.listen(PORT, () => {
    info(`Server running on port ${PORT}`)
})
