const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config()
const session = require("express-session")
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET
}))

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
    function (accessToken, refreshToken, profile, done) {
        // Save user profile to your database if needed
        return done(null, profile);
    }));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/hotelsAndHouses", (req, res) => {
    res.render("hotelsAndHouses");
});

app.get("/artic", (req, res) => {
    res.render("artic");
});
app.get("/amazing", (req, res) => {
    res.render("amazing");
});
app.get("/iconic", (req, res) => {
    res.render("icons");
});
app.get("/mansions", (req, res) => {
    res.render("mansions");
});
app.get("/boat", (req, res) => {
    res.render("boat");
});
app.get("/island", (req, res) => {
    res.render("island");
});
app.get("/cabins", (req, res) => {
    res.render("cabins");
});
app.get("/lakefront", (req, res) => {
    res.render("lakefront");
});




app.get("/hotel", (req, res) => {
    res.render("hotel");
});


// Google Authentication Routes
app.get("/login", (req, res) => {
    res.render("authO");
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

app.get('/profile', (req, res) => {
    res.render("home");
});

app.listen(3000, ()=>{
    console.log("Server running on http://localhost:3000");
})
