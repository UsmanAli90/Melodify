const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = express()

mongoose.connect('mongodb://localhost:27017/Test').then((result) =>
    app.listen(3000)).catch((err) =>
        console.log(err))


app.set('view engine', 'ejs')

app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })
})
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'SignUp' })
})


app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})
