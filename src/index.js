
const express = require('express');
const path = require('path');
const {engine} = require('express-handlebars');
const port = 3000;
const app = express();
const {add} = require('./math');

const LoginModel = require('./config/db');
const router = require('./routes/router');

app.engine('handlebars',engine());
app.set('view engine','handlebars');
app.set('views',path.join(__dirname,'resource/views'));
app.use(express.static(path.join(__dirname,'resource/views')));

app.use(express.urlencoded());
app.use(express.json());

router(app);
app.listen(port, () => console.log(add(5,12)));
