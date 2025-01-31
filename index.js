const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { sequelize } = require('./models')
const { createUser } = require('./controllers/userController')
const { searchImages, savePhoto, addtags, searchPhotosByTags } = require('./controllers/dataController')


const app = express()
app.use(express.json())
app.use(cors())


app.post('/api/users', createUser)
app.post('/api/photos', savePhoto)
app.post('/api/photos/:photoId/tags', addtags)
app.get('/api/search/photos', searchImages)
app.get('/api/photos/tag/search', searchPhotosByTags)


sequelize
    .authenticate()
    .then(() => {
        console.log("Database Connected....")
    })
    .catch((error) => {
        console.log('Unable to connect to the database:', error)
    })



const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server is running on, http://localhost:${PORT}`);
})

