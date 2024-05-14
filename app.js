const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const collection = require('./models/user')
const session = require('express-session');
const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const util = require('util');
const hashAsync = util.promisify(bcrypt.hash);


const app = express()
app.use(express.json())


let gfs
function initializeGridFSBucket() {
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
}

async function fileExists(filename) {
    const files = await gfs.find({ filename }).toArray();
    return files.length > 0;
}


async function uploadFileToGridFSIfNotExists(filename, filepath) {
    if (await fileExists(filename)) {
        console.log(`File '${filename}' already exists in the database.`);
        return;
    }

    try {
        const uploadStream = gfs.openUploadStream(filename);
        const readStream = fs.createReadStream(filepath);

        readStream.pipe(uploadStream);

        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        console.log(`File '${filename}' uploaded successfully.`);
    } catch (error) {
        console.error('Error uploading file to GridFS:', error);
    }
}

// async function getSongsFromDatabase() {
//     try {
//         const songs = await gfs.find().toArray();
//         console.log(songs)
//         return songs.map(song => ({
//             filename: song.filename,
//             duration1: song.duration // You need to fetch the duration from your database
//         }));
//     } catch (error) {
//         console.error('Error fetching songs from database:', error);
//         return [];
//     }
// }



mongoose.connect('mongodb://localhost:27017/Test').then(async () => {
    console.log('Connected to MongoDB');
    initializeGridFSBucket();
    // Usage
    const filename = 'sang rahiyo'
    const filepath = './songs/song1.mp3'
    const duration = '03:34'
    const filesToUpload = [
        { filename: 'Sang Rahiyo', filepath: './songs/song1.mp3', duration: '03:34' },
        // Add more files if needed
    ];

    for (const file of filesToUpload) {
        await uploadFileToGridFSIfNotExists(file.filename, file.filepath, file.duration);
    }




    // Start the server
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
    .catch((err) => {
        console.log("DB can't be connected ", err);
    });




// app.get('/play-song/:Sang Rahiyo', async (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const song = await gfs.find({ filename }).toArray();

//         if (!song || song.length === 0) {
//             return res.status(404).json({ error: 'Song not found' });
//         }

//         const readStream = gfs.openDownloadStreamByName(filename);
//         readStream.pipe(res);
//     } catch (error) {
//         console.error('Error playing song:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));



app.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })
})
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'SignUp' })
})



app.get('/home', isAuthenticated, async (req, res) => {
    try {
        const songs = await getSongsFromDatabase();
        res.render('home', { title: 'Home', username: req.session.user.fullName, songs });
    } catch (error) {
        console.error('Error rendering home page:', error);
        res.status(500).send('Error rendering home page');
    }
});

function isAuthenticated(req, res, next) {
    if (req.session.user) {

        next();
    } else {

        res.redirect('/login');
    }
}

app.get('/songs', async (req, res) => {
    try {
        const songs = await getSongsFromDatabase();
        console.log(songs); // Log fetched songs to the console
        res.json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


async function getSongsFromDatabase() {
    try {
        const songs = await gfs.find().toArray();
        const formattedSongs = songs.map(song => ({
            filename: song.filename,
            duration: song.metadata.duration,
            id: song._id
        }));
        console.log(formattedSongs); // Log formatted songs to the console
        return formattedSongs;
    } catch (error) {
        console.error('Error fetching songs from database:', error);
        return [];
    }
}





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
    // console.log("User data is ", userData)
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
            try {

                const newUser = new collection({
                    fullName: userData.fullName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    password: hash
                });
                console.log("Iam before save")
                console.log("user data before saving is : ", newUser)
                await newUser.save();

                res.redirect('/login');
            } catch (error) {
                console.error('Error saving user data in 1:', error);
                res.status(500).send('Error saving user data 1');
            }
        });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send('Error saving user data');
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("hey Iam before userdata1")
    const emailRegex = /^[^\s@]+@(gmail|hotmail|yahoo)\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!password) {
        return res.status(400).json({ error: 'Password field is required' });
    }
    console.log("hey Iam before userdata2")
    try {
        // const userData = await collection.findOne({ email: email }).maxTimeMS(30000); // Increase timeout to 30 seconds

        console.log("hey Iam before userdata3")
        const userData = await collection.findOne({ email: email });
        console.log("hey Iam after userdata")
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // Create session
        req.session.user = userData; // You can store the entire user data in the session
        console.log(req.session.user)
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/logout', (req, res) => {
    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // Redirect to login page after logout
            res.redirect('/login');
        }
    });
});


app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})
