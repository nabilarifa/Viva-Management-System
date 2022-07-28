const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
// import routes
const AuthRoute = require('./routes/Auth')
const ExamRoute = require('./routes/Exam')
const ProfileRoute = require('./routes/Profile')
const QuestionRoute = require('./routes/Question')
const VivaRoute = require('./routes/Viva')
const bodyParser = require('body-parser')

//const path = require('path');

dotenv.config();

const url = process.env.DB_CONNECT

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},()=>{
    console.log("Mongo Atlas connected Successfully!")
});

/// Actual middleWARES
app.use(cors())
const logger = require('morgan');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))

///app.use('/static', express.static(__dirname + "/static"));

///app.use(express.static(path.join(__dirname, 'static/css')));
app.use(logger('dev'));
app.use('/', AuthRoute)
app.use('/exam', ExamRoute);
app.use('/profile',ProfileRoute);
app.use('/question',QuestionRoute);
app.use('/viva',VivaRoute);

var myDate = new Date("2012-02-10T13:19:11+0000");
var myDate = encodeURI(myDate);
console.log(myDate);

app.listen(4000, () => {
    console.log("Server running on port 4000");
});
