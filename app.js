require('dotenv').config();

const express = require('express');
const connectdb = require('./server/config/db');
const expressEjsLayouts= require('express-ejs-layouts');
const cookie = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const app = express();

//db connection
connectdb();

//statics
app.use(express.static(__dirname + '/public'));

//configs
const PORT = 3000 || process.env.PORT;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookie());

//session
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store  : mongoStore.create({
        mongoUrl: process.env.MongoURI
    })
}))

//views
app.use(expressEjsLayouts);
app.set('layout', './main');
app.set('view engine','ejs');

app.use('/',require('./server/routes/main'));



app.listen(PORT, ()=>{console.log(`server is running on port ${PORT}`)});