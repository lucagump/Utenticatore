const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose') //DB

const cors = require('cors')//???

var port = process.env.PORT || 8080//8080 oppure quella di Heroku

app.use(cors())//???

app.use(bodyParser.json())//mi aspetto un json
app.use(bodyParser.urlencoded({extended: true}))//url nidificati

mongoose.Promise = global.Promise
var options = {
    useMongoClient: true,
    user: 'root',
    pass: 'root'
}
//connettiamo il db, account creato, r/w, aggiungeremo sempre qui ma con tabelle diverse
mongoose.connect('mongodb://<root>:<root>@ds247317.mlab.com:47317/utenticatore', options).then(
  () => {console.log('DB connected succesfully!')},
  error => {console.error(`Error while connecting to DB: ${error.message}`)}
)
//Create schema for table
var users = mongoose.Schema({
  username: String,
  password: String,
  age: Number,
  city: String
})
//create Table
var User = mongoose.model('User',users)

app.post('/v1/user',(req,res) =>{
  var element = new User({
    username: req.body.username,
    password: req.body.password,
    age: req.body.age,
    city: req.body.city,
  })
  element.save(function (error) {
    if (error){
      res.sendStatus(400);
      return console.error(error)
    }
    console.log("Element inserted to Users Schema.")
    res.json({
      username: req.body.username,
      password: req.body.password,
      age: req.body.age,
      city: req.body.city
    })
  })
})
//ritorno users, senza query particolare
app.get('/v1/user', (req,res) => {
  search = {}
  User.find(search, 'username age city', function(error,data){
    if(error){
      res.sendStatus(404)
    }
    else(
      res.json(data)
    )
  })
})
//ritorna dati impo utente
app.get('/v1/login', (req,res) => {
  search = {
    username: req.query.username,
    password: req.query.password,
   }
  User.find(search, 'username age city', function(error,data){
    if(error){
      res.sendStatus(404)
    }else{
      if(data.length == 0)
        res.sendStatus(404)
      res.json(data)
    }
  })
})
//update username
app.put('/v1/user/:username', (req,res) => {
  search = {
    username: req.params.username,
  }
  newInfo = {
    age: req.body.age,
    city: req.body.city,
  }
  User.findOneAndUpdate(search, newInfo, function(error,data){
    if(error) return res.send(500, {error: error})
      return res.send('succesfully saved')
  })
})
//delete user
app.delete('/v1/user/:username', (req,res) => {
  search = {username:req.params.username}
  User.findOneAndRemove(search, function(error, data){
  if (error) return res.send(500, { error: error })
    return res.send(207)
  })
})

app.listen(port)
console.log("App listening to port "+port)
