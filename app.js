
const generalDebugger = require('debug')('app:general');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const mongoose = require('mongoose');
const helmet = require('helmet');
//const first_middleware = require('./first_middleware');
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

mongoose.connect(config.get('db.location'),{ useNewUrlParser: true })
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


async function createLFG(){
    const lfg = new LFG({
        creator_id: "376055309657047040",
        creator_btag: "Javu#2632",
        activity: "Ocaso",
        time_zone: "America/BsAs",
        participants: [ "Javu#2632" ]
    });
    
    try{
        const result = await lfg.save();
        dbDebugger(result);
    }
    catch(ex){
        for(field in ex.errors)
            dbDebugger(ex.errors[field].message);
    }
    //const result = await lfg.save();
    //dbDebugger(result);
}

//createLFG();

async function getAllLFGS(){
    return await LFG.find().select('activity participants');
    //const lfgs = await LFG.find();
    /*
    //Custom filters!!!
    .find({creator_btag: "Javu#2632"})
.or ( [{item1: "test1"}, {item2: "test2"}, {name: /.*Javu$/}] )
    .and ( [{item1: "test1"}, {item2: "test2"}] )
    .limit(10)
    .sort({creator_id: 1}) // 1 ascending // -1 descending o "creator_id" // "-creator_id"
    .select({activity:1, date_time:1}); // Only display relevant data
    */
    //dbDebugger("List of LFG's:");
    //dbDebugger(lfgs);
}

async function updateLFG(id){
    //Query First
    //find by id
    const lfg = await LFG.findById(id);
    if (!lfg) return;
    //Modify
    lfg.set({
        activity : 'Calus'
    });
    //Save
    const result = await lfg.save();
    dbDebugger(result);
}

async function updateDirectlyLFG(id){
    const result = await LFG.update( {_id: id},{
        $set: {
            activity: 'Argos'
        }
    });
    dbDebugger(result);
}


async function removeLFG(id){
    const result = await LFG.deleteOne( {_id: id} );
    dbDebugger(result);
}

/*
async function run() {
    const lfg = await getAllLFGS();
    dbDebugger("List of LFG's:");
    dbDebugger(lfg);
    updateLFG("5d8e2d20c88950313ce765f2");
}

run();
*/

app.get('/', (req, res) => {
    res.send('Revenants LFG APP !!');
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port} dude ...`));