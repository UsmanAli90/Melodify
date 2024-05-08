const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');

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
    const { fullName, email, confirmEmail, phoneNumber, password } = req.body;

    if (!fullName || !email || !confirmEmail || !phoneNumber || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@(gmail|hotmail|yahoo)\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if confirmEmail matches email
    if (email !== confirmEmail) {
        return res.status(400).json({ error: 'Email addresses do not match' });
    }

    // Validate phone number format
    const phoneRegex = /^\d{11,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Check if password is at least 8 characters long and contains at least one special character
    const passwordRegex = /^(?=.*[@$])(?=.*[a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one special character like @ or $' });
    }

    try {
        const existingUser = await collection.findOne({ name: fullName });

        if (existingUser) {
            return res.send("User already exists. Please try another name.");
        }
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new collection({
            name: fullName,
            email: email,
            phone: phoneNumber,
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
