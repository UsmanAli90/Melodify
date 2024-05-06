const express = require('express')

const app = express()

app.set('view engine', 'ejs')


app.listen(3000);
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
