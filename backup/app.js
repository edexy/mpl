const express = require("express");
const redis   = require("redis");
const session = require('express-session');
const redisStore = require('connect-redis')(session);

const app = express();
const client  = redis.createClient();

const bodyParser = require("body-parser");
var cookieParser    =     require('cookie-parser');
const mongoose = require("mongoose");

//load admin routes 
const adminRouter = require("./router/admin/admin");
const teamRouter = require("./router/admin/teams");
const fixtureRouter = require("./router/admin/fixtures");

//load user routes
const userRouter = require("./router/users/user");
const userTeam = require("./router/users/teams");
const userFixtures = require("./router/users/fixtures");

// connect to DB
mongoose.connect("mongodb+srv://web-root1:Zv8p3ZOtBejmkUgf@cluster0-fnyms.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// configure express to use bodyParser json method
app.use(bodyParser.json());
app.use(cookieParser("secretSign#143_!223"));

//redis session middleware initializer
app.use(session({
    secret: 'sZv8p3ZOtBejmkUgh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client}),
    saveUninitialized: false,
    resave: false
}));

client.on('error', (err) => {
    console.log("Error " + err)
});

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// let express use router
app.use(adminRouter);
app.use(teamRouter);
app.use(fixtureRouter);
app.use(userRouter);
app.use(userTeam);
app.use(userFixtures);

// error middleware
app.use((req, res, next) => {
    res.status(404).send('Api endpoint not available')
});

//error 500
app.use((err, req, res, next) => {
    console.error(err.stack)
});

// listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started, listening on PORT ${PORT}`);
});
module.exports = app;