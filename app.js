const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

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

app.get('/verify-otp', (req, res) => {
    const error = req.query.error || null;
    res.render('verify-otp', { error: error, title: "Verify-OTP" });
});

// Function to send mail to the email

async function sendOTP(email, otp) {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Change this to your email service provider
        auth: {
            user: 'f219133@cfd.nu.edu.pk', // Your email address
            pass: 'razzaq@12345', // Your email password
        },
    });

    // Define email options
    const mailOptions = {
        from: 'f219133@cfd.nu.edu.pk', // Sender address
        to: email, // Recipient address
        subject: 'Verification OTP', // Subject line
        text: `Your OTP for email verification is: ${otp}`, // Plain text body
    };

    // Send email
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
        // Generate OTP
        const otp = generateOTP();
        // Store OTP temporarily
        otpStorage[otp] = true; // Store OTP directly without using email as key
        sendOTP(email, otp); // Send OTP to email
        // Redirect to OTP verification page
        res.redirect('/verify-otp');
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send('Error sending OTP');
    }

})


app.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;

    // Retrieve stored user data along with OTP
    const userData = otpStorage[otp];

    if (!userData) {
        const error = "Invalid OTP";
        // Redirect to the OTP verification page with the error message
        return res.redirect(`/verify-otp?error=${encodeURIComponent(error)}`);
    }

    try {
        // Save user data into the database
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(userData.password, saltRounds);

        const newUser = new collection({
            name: userData.fullName,
            email: userData.email,
            phone: userData.phoneNumber,
            password: hashPassword
        });

        await newUser.save();

        // Clear OTP storage
        delete otpStorage[otp];

        // Redirect to login page
        res.redirect('/login');
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send('Error saving user data');
    }
});


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
