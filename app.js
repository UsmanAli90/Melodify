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
const Playlist = require('./models/playlist')
const path = require('path');


const app = express()
app.use(express.json())





mongoose.connect('mongodb://localhost:27017/Test').then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const gfs = new GridFSBucket(db);

    // Define an array of songs with their metadata
    const songs = [
        {
            songname: 'Numb',
            songcategory: 'English',
            songduration: '3:45',
            songartist: 'Artist 1',
            filepath: './assets/songs/Numb.mp3'
        },
        {
            songname: 'Sang Rahiyo',
            songcategory: 'Category 2',
            songduration: '4:20',
            songartist: 'Artist 2',
            filepath: './assets/songs/song1.mp3'
        },
        {
            songname: 'Amplifier',
            songcategory: 'Pop',
            songduration: '3:52',
            songartist: 'Imran Khan',
            filepath: './assets/songs/pop/Imran Khan - Amplifier.mp3'
        },
        {
            songname: 'FELONY (feat. Talhah Yunus, Calm & Faris Shafi)',
            songcategory: 'Pop',
            songduration: '3:54',
            songartist: 'Umair',
            filepath: './assets/songs/pop/Umair - FELONY (feat. Talhah Yunus, Calm & Faris Shafi).mp3'
        },
        {
            songname: 'Talwiinder, Vision - Nasha',
            songcategory: 'Pop',
            songduration: '3:06',
            songartist: 'Talwinder',
            filepath: './assets/songs/pop/Talwiinder, Vision - Nasha.mp3'
        },
        {
            songname: 'Dont Mind',
            songcategory: 'Pop',
            songduration: '3:14',
            songartist: 'Artist 2',
            filepath: './assets/songs/pop/Talhah Yunus, Talha Anjum, Young Stunners, Rap Demon - Dont Mind.mp3'
        }

        // Add more songs if needed
    ];

    async function songExists(songname) {
        return await SongCollection.exists({ songname });
    }


    // Function to check if a song already exists in the database
    const uploadFileToGridFS = (filePath) => {
        return new Promise((resolve, reject) => {
            if (!filePath) {
                return reject(new Error('File path is undefined'));
            }

            const filename = path.basename(filePath);
            const uploadStream = gfs.openUploadStream(filename);
            fs.createReadStream(filePath).pipe(uploadStream)
                .on('error', (error) => {
                    reject(error);
                })
                .on('finish', () => {
                    resolve(uploadStream.id);
                });
        });
    };

    // Iterate over each song, check for duplicates, upload it to GridFS, and save its metadata in the Songs collection
    for (const song of songs) {
        try {
            const exists = await songExists(song.songname);
            if (exists) {
                console.log(`Song already exists: ${song.songname}`);
                continue; // Skip this song if it already exists
            }

            if (!fs.existsSync(song.filepath)) {
                throw new Error(`File does not exist at path: ${song.filepath}`);
            }

            const fileId = await uploadFileToGridFS(song.filepath);
            const newSong = new SongCollection({
                songname: song.songname,
                songcategory: song.songcategory,
                songduration: song.songduration,
                songartist: song.songartist,
                songpath: fileId
            });
            await newSong.save();
            console.log(`Uploaded and saved song: ${song.songname}`);
        } catch (error) {
            console.error(`Failed to upload and save song: ${song.songname}`, error);
        }
    }

    console.log('All songs have been processed.');
}).catch((error) => {
    console.error('Failed to connect to MongoDB', error);
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
app.get('/song/:id', async (req, res) => {
    const songId = req.params.id;
    try {
        const song = await SongCollection.findById(songId);
        if (!song) {
            return res.status(404).send('Song not found');
        }

        // Assuming you are using GridFS for storing song files
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'songs' // This should match the name of your GridFS bucket
        });

        const downloadStream = bucket.openDownloadStream(song._id);

        downloadStream.on('error', () => {
            res.sendStatus(404);
        });

        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error fetching the song:', error);
        res.status(500).send('Internal Server Error');
    }
});

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

// app.get('/songs', async (req, res) => {
//     try {
//         const songs = await getSongsFromDatabase();
//         console.log(songs); // Log fetched songs to the console
//         res.json(songs);
//     } catch (error) {
//         console.error('Error fetching songs:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// async function getSongsFromDatabase() {
//     try {
//         const songs = await gfs.find().toArray();
//         const formattedSongs = songs.map(song => ({
//             filename: song.filename,
//             duration: song.metadata.duration,
//             id: song._id
//         }));
//         console.log(formattedSongs); // Log formatted songs to the console
//         return formattedSongs;
//     } catch (error) {
//         console.error('Error fetching songs from database:', error);
//         return [];
//     }
// }





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
