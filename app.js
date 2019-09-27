
const generalDebugger = require('debug')('app:general');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const mongoose = require('mongoose');
const helmet = require('helmet');
//const Joi = require('joi');
const first_middleware = require('./first_middleware');
const express = require('express');
const morgan = require('morgan')
const moment = require('moment-timezone');
const app = express();
const lfgs = require('./lfgs/lfgs');
const lfgs_types = require('./lfgs_types/lfgs_types');


//CONFIG
generalDebugger('App Name: ' + config.get('name'));
//generalDebugger('Using DB: ' + config.get('db.host'));
//generalDebugger('DB user: ' + config.get('db.user'));
//generalDebugger('DB password: ' + config.get('db.password'));

mongoose.connect(config.get('db.location'))
    .then(() => dbDebugger("Connected to MLAB db ..."))
    .catch(err => dbDebugger("Could not connect to MLAB db: "+err.message));

//console.log(`NODE_ENV:${process.env.NODE_ENV}`);
//console.log(`app:${app.get('env')}`); //Default development

//MiddleWare
app.use(express.json()); // Parse req.body to JSON
app.use(express.urlencoded({extended:true})); // Parse req.body to x-www-form-url : key=value&key=value
app.use(helmet());
app.use(express.static('public'));
app.use('/api/lfgs', lfgs);
app.use('/api/lfgs_types', lfgs_types);
//Apply First Custom middleware
//app.use(first_middleware);
/*
app.use(function(req, res, next){
    console.log('Aplying second MiddleWare');
    next();
});
*/
// Configuracion de morgan para loguear los requests a la consola
//morgan.token('date', (req:any, res:any, tz:any) => { //TypeScript
morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format("YYYY-MM-DD HH:mm:ss");
});

morgan.token('status', (req, res) => {
    return res.statusCode.toString()
});

morgan.format('myformat', '[:date[America/Buenos_Aires]] :status ":method :url" \t:res[content-length] \t\t:remote-user');

app.use(morgan(
    'myformat',
    {
        skip: function (req, res) { 
            return res.statusCode == 204 || res.statusCode==304
        }
    }
));
// Last MiddleWare is always the route handler
/*
const lfgs = [
    {id: 1, creator_id: '1', creator_btag:'Javu#2632', activity: 'Calus', date: ' ',time: ' ', time_zone: ' '},
    {id: 2, creator_id: '1', creator_btag:'Javu#2632', activity: 'Last Wish', date: ' ',time: ' ', time_zone: ' '},
    {id: 3, creator_id: '1', creator_btag:'Javu#2632', activity: 'Corona del Dolor', date: ' ',time: ' ', time_zone: ' '}
]
*/
const lfgs_Schema = new mongoose.Schema({
    name: String,
    creator_id: String,
    creator_btag: String,
    activity: String,
    //date_time: {type: Date("<YYYY-mm-ddTHH:MM:ssZ>"), default:Date("<YYYY-mm-ddTHH:MM:ssZ>").now},
    date_time: {type: Date, default:Date.now},
    time_zone: String
});

const LFG = mongoose.model('LFGS',lfgs_Schema);
const lfg = new LFG({
    creator_id: "376055309657047040",
    creator_btag: "Javu#2632",
    activity: "Ocaso",
    time_zone: "America/BsAs"
});

app.get('/', (req, res) => {
    res.send('Revenants LFG APP !!');
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port} dude ...`));