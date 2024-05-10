const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const collection = require('./models/user')

const app = express()
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/Test').then((result) =>
    app.listen(3000)).catch((err) =>
        console.log("DB can't be connected ", err))


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

app.get('/verify-otp', (req, res) => {
    const error = req.query.error || null;
    res.render('verify-otp', { error: error, title: "Verify-OTP" });
});


async function sendOTP(email, otp) {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'f219133@cfd.nu.edu.pk',
            pass: 'razzaq@12345',
        },
    });


    const mailOptions = {
        from: 'f219133@cfd.nu.edu.pk',
        to: email,
        subject: 'Verification OTP',
        text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

const otpStorage = {};


app.post('/signup', async (req, res) => {
    const { fullName, email, confirmEmail, phoneNumber, password } = req.body;

    if (!fullName || !email || !confirmEmail || !phoneNumber || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }


    const emailRegex = /^[^\s@]+@(gmail|hotmail|yahoo)\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }


    if (email !== confirmEmail) {
        return res.status(400).json({ error: 'Email addresses do not match' });
    }


    const phoneRegex = /^\d{11,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }


    const passwordRegex = /^(?=.*[@$])(?=.*[a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one special character like @ or $' });
    }


    try {

        const otp = generateOTP();
        otpStorage[otp] = { fullName, email, phoneNumber, password };
        sendOTP(email, otp);
        res.render('verify-otp', { fullName, email, phoneNumber, password });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send('Error sending OTP');
    }

})



app.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    const userData = otpStorage[otp];
    console.log("User data is ", userData)
    if (!userData) {
        const error = "Invalid OTP";
        return res.redirect(`/verify-otp?error=${encodeURIComponent(error)}`);
    }

    try {

        const saltRounds = 10;
        bcrypt.hash(userData.password, saltRounds, async (err, hash) => {
            if (err) {

                console.error('Error hashing password:', err);
                return res.status(500).send('Error hashing password');
            }
            console.log("Things are: ", userData.fullName, userData.email, userData.phoneNumber, hash)
            try {
                const newUser = new collection({
                    fullName: userData.fullName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    password: hash
                });
                console.log("New user is: ", newUser.fullName, newUser.email, newUser.phoneNumber, newUser.password)
                await newUser.save();

                res.redirect('/login');
            } catch (error) {
                console.error('Error saving user data:', error);
                res.status(500).send('Error saving user data');
            }
        });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send('Error saving user data');
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;


    const emailRegex = /^[^\s@]+@(gmail|hotmail|yahoo)\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!password) {
        return res.status(400).json({ error: 'Password field is required' });
    }
    try {
        const userData = await collection.findOne({ email: email });
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }
        const ispassword = await bcrypt.compare(req.body.password, userData.password)
        if (!ispassword) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        res.redirect('/home');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})
