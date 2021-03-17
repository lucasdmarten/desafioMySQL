const express = require("express");
const path = require("path");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");

const {createTokens, validateToken} = require("./JWT.js");


const routesAPI = require('./routes/pages');
const routesAUTH = require('./routes/auth');


const dotenv = require("dotenv");
const { read } = require("fs");
dotenv.config({
    path: './.env'
});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
db.connect( (error) => {
    if(error) {
        console.log(error);
    } else {
        console.log("MYSQL Connected...  \n" + "host " + process.env.DATABASE_USER + ", usando database " + process.env.DATABASE)
    }
})

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));


// Parse URL-encoded bodies (as sent by html forms)
app.use(express.urlencoded({
    extended: false
}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'hbs');

// Definindo rotas a partir de ./routes/pages.js
app.use('/', routesAPI)
app.use('/auth', routesAUTH)



app.listen(4000, ()=>{
    console.log("Runserver on 4000...");
});
