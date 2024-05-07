const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = express()
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/Test').then((result) =>
    app.listen(3000)).catch((err) =>
        console.log(err))


app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })
})
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'SignUp' })
})

app.get('/home', (req, res) => {
    res.render('home', { title: 'Home' })
})


app.post('/signup', async (req, res) => {
    const { fullname, email, phone, password } = req.body;

    try {
        const existingUser = await collection.findOne({ name: fullname });

        if (existingUser) {
            return res.send("User already exists. Please try another name.");
        }
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new collection({
            name: fullname,
            email: email,
            phone: phone,
            password: hashPassword
        });

        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }

})

app.post('/login', (req, res) => {
    const userdata = new collection({
        email: req.body.email,
        password: req.body.password
    });
    const { email, password } = req.body;
    collection.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const ispassword = bcrypt.compare(req.body.password, user.password)
            if (!ispassword) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            res.redirect('/home');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        });


})


app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})
