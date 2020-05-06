const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const redis = require('./api/configs/redisConfig');
const timeout = require('connect-timeout');
const app = express();

//Imports
const quotesRoute = require('./api/routes/quotes');
const quoteRouteV2 = require('./api/routes/quotesV2');

//Database connection
mongoose.connect(process.env.DB_URL || 'mongodb+srv://prathameshmore:pmore9420@quotedatabase-btgnl.mongodb.net/test?retryWrites=true&w=majority', {
    dbName: 'quotes',
    useUnifiedTopology: true,
    useNewUrlParser: true
}, () => {
    console.log("Connected to Database");
});

app.use(timeout('60s'));
app.use(express.static("public"));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use('/quotes', quotesRoute);
app.use('/api', quoteRouteV2);

app.use('/', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.sendFile(__dirname + '/public/index.html');
    next();
});


module.exports = app;
