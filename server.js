const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const quoteController = require('./controllers/quotes.js');

const port = process.env.PORT || 3000;
const path = require('path')

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan("dev"));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public"))); //for css/

app.use(
    session({
       secret: process.env.SESSION_SECRET,
       resave: false,
       saveUninitialized: true, 
    })
);

app.use(passUserToView);
 

app.get('/', (req, res) => {
res.render("home.ejs")
});

app.get('/motivational-wall', (req, res) => {
    if (req.session.user) {
        res.render('quotes/index.ejs', {
            user: req.session.user,
            currentQuote: "Your daily dose of inspiration!",
            savedQuotes: []
        });
    } else {
        res.send('Please login to view your motivation wall.');
    }    
})

app.use('/auth', authController);
app.use('/quotes', isSignedIn, quoteController);


//start server 
app.listen(port, () => {
    console.log(`Daily Motivation app running on port ${port}!`);
});