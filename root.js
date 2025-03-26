const express = require('express');
const session = require('express-session')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/usermodel');
const Team = require('./model/teammodel');
const bcrypt = require('bcryptjs');
const axios = require('axios');


const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const rapidkey = process.env.RAPIDAPI_KEY;

const connectionParams = {};

mongoose
    .connect(uri, connectionParams)
    .then(() => {
        console.info("Connected to DB");
    })
    .catch((e) => {
        console.log("Error: ", e);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    name: 'my.sid',
    secret: 'tech',
    resave: false,
    saveUninitialized: true,
}));

app.set("view engine", "ejs");
app.set('views',path.join(process.cwd(), 'views'));

app.get('/', (req, res) => {
    res.render('auth');
});

app.post("/registration", async (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({
        username,
        password: hashedPassword,
        isAdmin: false,
        deletedAt: null,
    })
    const currentUser = await User.findOne({username}) 
    if (currentUser){
        return res.status(409).json({message: "Username already in use"})
    } 
    const user = await newUser.save()

    req.session.user = user;

    res.status(200).json({redirect: '/'});
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const currentUser = await User.findOne({username}) 
    if (!currentUser || !await bcrypt.compare(password, currentUser.password)){
        return res.status(404).json({message: "Incorrect username or password"})
    }   

    req.session.user = currentUser;

    if (currentUser.isAdmin) {
        res.status(200).json({redirect: '/adminpanel', user: currentUser});
    } else {
        res.status(200).json({redirect: '/teams', user: currentUser});
    }
})

app.post('/language', (req, res) => {
    req.session.language = req.body.language;
    res.sendStatus(200);
});

app.get('/language', (req, res) => {
    res.json({ language: req.session.language || 'en' });
});

app.get('/teams', async (req, res) => {
    const language = req.session.language || 'en';
    if (req.query.name) {
        const regex = new RegExp(req.query.name, 'i');
        const team = await Team.findOne({ $or: [{ 'names.en': regex }, { 'names.ru': regex }] });
        res.json({ team });
    } else {
        const teams = await Team.find();
        res.render('index', { teams, language });
    }
});

app.get('/teams/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ team });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/addTeam', async (req, res) => {
    const newTeam = new Team(req.body);

    try {
        const team = await newTeam.save();
        res.status(200).json({ team });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/updateTeam/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findByIdAndUpdate(teamId, req.body, { new: true });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ team });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/deleteTeam/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findByIdAndDelete(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(200).json({ message: 'Team deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if(err) {
        return res.redirect('/teams');
      }
      res.clearCookie('my.sid');
      res.redirect('/');
    });
});

function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
}

app.get('/adminpanel', requireAuth, async (req, res) => {
    if (!req.session.user.isAdmin) {
        return res.redirect('/');
    }

    const users = await User.find({});
    const teams = await Team.find({});

    res.render('adminpanel', { users, teams });
});


app.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/addUser', async (req, res) => {
    const { username, password, isAdmin } = req.body;

    const newUser = new User({
        username,
        password,
        isAdmin,
        deletedAt: null,
    });

    try {
        const user = await newUser.save();
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/updateUser/:userId', async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndUpdate(userId, { username, password, isAdmin }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/deleteUser/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/horoscope/:sign', async (req, res) => {
    const options = {
        method: 'GET',
        url: `https://horoscopes-ai.p.rapidapi.com/get_horoscope_en/${req.params.sign}/weekly/general`,
        headers: {
            'X-RapidAPI-Key': rapidkey,
            'X-RapidAPI-Host': 'horoscopes-ai.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/coinflip', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://coin-flip1.p.rapidapi.com/headstails',
        headers: {
            'X-RapidAPI-Key': rapidkey,
            'X-RapidAPI-Host': 'coin-flip1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});