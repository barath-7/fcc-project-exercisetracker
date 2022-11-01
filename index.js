const express = require('express')
const app = express()
const cors = require('cors')
const { createExercise, createUser, getExerciseDetails, getAllUsers } = require('./controller')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyPasrser = require('body-parser')

app.use(cors())
app.use(express.static('public'))
app.use(bodyPasrser.urlencoded({extended:true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB CONNECTED..");
  })
  .catch((err) => {
    console.log("DB connection failed");
  });

//create user
app.post('/api/users',createUser);

//get all user
app.get('/api/users',getAllUsers);

//create exercise
app.post('/api/users/:_id/exercises',createExercise);

//get excercise data (logs)
app.get('/api/users/:_id/logs',getExerciseDetails)



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
