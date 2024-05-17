const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('./models/user')
const session = require('express-session');
const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const util = require('util');
const hashAsync = util.promisify(bcrypt.hash);
const SongCollection = require('./models/songs')
const path = require('path');


const app = express()
app.use(express.json())





mongoose.connect('mongodb://localhost:27017/Test').then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;

    // Define an array of songs with their metadata
    const songs = [
        {
            songname: 'Numb',
            songcategory: 'English',
            songduration: '3:45',
            songartist: 'Artist 1',
            songfilepath: path.join(__dirname, './assets/songs/Numb.mp3')
        },
        {
            songname: 'SangRahiyo',
            songcategory: 'Category 2',
            songduration: '4:20',
            songartist: 'Artist 2',
            songfilepath: path.join(__dirname, './assets/songs/SangRahiyo.mp3')
        },
        {
            songname: 'SadiGali',
            songcategory: 'Category 2',
            songduration: '4:25',
            songartist: 'Artist 2',
            songfilepath: path.join(__dirname, './assets/songs/SadiGali.mp3')
        },
        {
            songname: 'Amplifier',
            songcategory: 'Category 2',
            songduration: '4:25',
            songartist: 'Artist 2',
            songfilepath: path.join(__dirname, './assets/songs/Amplifier.mp3')
        },
        {
            songname: 'DontMind',
            songcategory: 'Category 2',
            songduration: '4:25',
            songartist: 'Artist 2',
            songfilepath: path.join(__dirname, './assets/songs/DontMind.mp3')
        },
        {
            songname: 'Felony',
            songcategory: 'Category 2',
            songduration: '4:25',
            songartist: 'Artist 2',
            songfilepath: path.join(__dirname, './assets/songs/Felony.mp3')
        },
        {
            songname: 'Nasha',
            songcategory: 'Category 2',
            songduration: '4:25',
            songartist: 'Artist 2',
            songfilepath: path.join(__dirname, './assets/songs/Nasha.mp3')
        },
        // Add more songs if needed
    ];

    // Function to check if a song already exists in the database
    async function songExists(songname) {
        return await SongCollection.exists({ songname });
    }


    async function uploadSongMetadata(song) {
        // Check if the song already exists
        if (await songExists(song.songname)) {
            console.log(`Song '${song.songname}' already exists in the database. Skipping upload.`);
            return;
        }

        // Save song metadata to the database
        const newSong = new SongCollection(song);
        await newSong.save();
        console.log(`Song '${song.songname}' metadata uploaded successfully.`);
    }



    // Upload all songs
    try {
        await Promise.all(songs.map(uploadSongMetadata));
        console.log('All song metadata uploaded successfully');
    } catch (error) {
        console.error('Error uploading song metadata:', error);
    }
    console.log("BEFORE GET SONG REQUEST")

    // Start the server
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
    .catch((err) => {
        console.log("DB can't be connected ", err);
    });




app.get('/play-song/:id', async (req, res) => {
    const songid = req.params.id;
    console.log("ID IS: ", songid);

    try {
        // Fetch the song metadata from the database
        const song = await SongCollection.findById(songid);

        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        // Serve the song file
        const songPath = path.join(__dirname, 'assets', 'songs', `${song.songname}.mp3`);

        if (fs.existsSync(songPath)) {
            res.sendFile(songPath);
        } else {
            res.status(404).json({ error: 'Song file not found' });
        }
    } catch (error) {
        console.error('Error playing song:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/search-song', async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const songs = await SongCollection.find({
            $or: [
                { songname: { $regex: searchQuery, $options: 'i' } },
                { songartist: { $regex: searchQuery, $options: 'i' } },
                { songcategory: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        // Check if any songs were found
        if (songs.length === 0) {
            return res.status(404).json({ error: 'No songs found' });
        }
        console.log(songs);

        // Send the search results back to the client
        res.json(songs);
    } catch (error) {
        console.error('Error searching for song:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function getSongsFromDatabase() {
    try {
        const songs = await SongCollection.find({});
        return songs;
    } catch (error) {
        console.error('Error fetching songs from database:', error);
        throw error;
    }
}


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
app.get('/search', (req, res) => {
    res.render('search', { title: 'Search' });
});

app.get('/home', isAuthenticated, async (req, res) => {

    try {
        const songs = await getSongsFromDatabase();
        // console.log(songs)
        // const songsString = JSON.stringify(songs);
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

                const newUser = new User({
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
        console.log("hey Iam before userdata3")
        console.log("hey Iam before finding email")
        const userData = await User.findOne({ email: email });
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
