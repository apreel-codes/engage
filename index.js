require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo')(session);

const helmet = require('helmet');

const User = require('./models/user');

const dbUrl = 'mongodb://127.0.0.1:27017/engage';

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const replyRoutes = require('./routes/replies');

const mongoSanitize = require('express-mongo-sanitize');

mongoose.connect(dbUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

mongoose.connect('mongodb://localhost:27017/engage', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open!!")
    })
    .catch(err => {
        console.log('Mongo Connection Error!')
        console.log(err)
     })


app.use(express.static(path.join(__dirname, 'assets')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize({ 
    replaceWith: '_'
})); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('ejs', ejsMate);

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user; //checks who is currently logged in
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:id/comments', commentRoutes);
app.use('/posts/:id/comments/:commentId/replies', replyRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err })
})


app.listen('3000', () => {
    console.log('LISTENING ON PORT 3000!')
})