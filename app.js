const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const passport = require("passport");
const localStrategy = require("passport-local");
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//const User = require('./models/user');

const Citizen = require('./models/citizen');
const Police = require('./models/police');
const Forum = require('./models/forum');

const indexRoutes = require('./routes/index');
const citizenRoutes = require('./routes/citizen');
const policeRoutes = require('./routes/police');
const criminalRoutes = require('./routes/criminal');

require('dotenv').config();

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

const expressSession = require("express-session");
const sessionMiddleware = expressSession({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 4320000 }, // 12 Hrs
    store: new MongoStore({
        url: mongoDBURI,
        autoReconnect: true,
    })
});

app.use(sessionMiddleware);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use('policeLogin', new localStrategy(Police.authenticate()));
passport.use('citizenLogin', new localStrategy(Citizen.authenticate()));



passport.serializeUser((entity, done) => {
    done(null, { username: entity.username, status: entity.status });
});

passport.deserializeUser(function (obj, done) {
    switch (obj.status) {
        case 'citizen':
            Citizen.findOne({ username: obj.username })
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
            Police.findOne({ username: obj.username })
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
app.use('/citizen', citizenRoutes);
app.use('/police', policeRoutes);
app.use('/criminal', criminalRoutes);

io
    .use(function (socket, next) {
        sessionMiddleware(socket.request, {}, next);
    }).on('connection', client => {
        let user;
        try { // Only Authenticated users allowed
            user = client.request.session.passport.user;
        } catch (e) {
            return;
        }
        console.log(user);
        console.log("Client Connected");
        client.on("createMessage", async (message, callback) => {
            if (!message.text) {
                return callback();
            }
            const msg = {
                from: user.username,
                admin: (user.status === 'police'),
                text: message.text,
                createdAt: moment().valueOf()
            };
            io.emit("newMessage", msg);
            try {
                msg.createdAt = moment(msg.createdAt).format('h:mm a');
                await Forum.create(msg);
                console.log("Saved to DB")
            } catch (e) {
                console.log(e);
            }
            callback();
        });

        client.on('disconnect', () => {
            console.log("Client disconnected");
        });
    });

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
