const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");


const Citizen = require('./models/citizen');
const Police = require('./models/police');

const indexRoutes = require('./routes/index');
const citizenRoutes = require('./routes/citizen');
const policeRoutes = require('./routes/police');

require('dotenv').config()

const mongoDBURI = process.env.MONGODB_URI;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoDBURI, () => {
    console.log("connected to DB");
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 4320000 }, // 12 Hrs
    store: new MongoStore({
        url: mongoDBURI,
        autoReconnect: true,
    })
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser((entity,done)=>{
    done(null, { username: entity.username, status: entity.status });
});

passport.deserializeUser(function (obj, done) {
    switch (obj.status) {
        case 'citizen':
            Citizen.findOne({username: obj.username})
                .then(user => {
                    if (user) {
                        done(null, user);
                    }
                    else {
                        done(new Error('Citizen id not found:' + obj.username, null));
                    }
                });
            break;
        case 'police':
            Police.findOne({username: obj.username})
                .then(police => {
                    if (police) {
                        done(null, police);
                    } else {
                        done(new Error('Police id not found:' + obj.username, null));
                    }
                });
            break;
        default:
            done(new Error('no entity type:', obj.type), null);
            break;
    }
});

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


app.use(indexRoutes);
app.use('/citizen',citizenRoutes);
app.use('/police',policeRoutes);

const PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log(`Server Running on Local host ${PORT}`);
});
