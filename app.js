

const Joi = require('joi');
const express = require('express');
const app = express();

//MiddleWare
app.use(express.json());

const lfgs = [
    {id: 1, creator_id: '1', creator_btag:'Javu#2632', activity: 'Calus', date: ' ',time: ' ', time_zone: ' '},
    {id: 2, creator_id: '1', creator_btag:'Javu#2632', activity: 'Last Wish', date: ' ',time: ' ', time_zone: ' '},
    {id: 3, creator_id: '1', creator_btag:'Javu#2632', activity: 'Corona del Dolor', date: ' ',time: ' ', time_zone: ' '}
]

const lfgs_types = [
    {id: 1,
     name: "Vanguardia",
     num_guardians:[3],
     activities:[
         {nombre_acticvidad: "Asalto"},
         {nombre_acticvidad: "Ocaso"},
         {nombre_acticvidad: "Ocaso 100K"},
         {nombre_acticvidad: "Ocaso 200K"}
     ]
    },
    {id: 2,
        name: "Crisol",
        num_guardians:[2,3,4,5,6],
        activities:[
            {nombre_acticvidad: "Competitivo"},
            {nombre_acticvidad: "QuickPlay"},
            {nombre_acticvidad: "Iron Banner"},
            {nombre_acticvidad: "Dobles"},
            {nombre_acticvidad: "Rumble"},
            {nombre_acticvidad: "Partida Privada"}
        ]
    },
    {id: 3,
        name: "Gambito",
        num_guardians:[2,3,4],
        activities:[
            {nombre_acticvidad: "Gambito Supremo"},
            {nombre_acticvidad: "Gambito Normal"},
            {nombre_acticvidad: "Decision", Niveles: ["Nivel_1","Nivel_2","Nivel_3"]}
        ]
    },
    {id: 4,
        name: "Raids",
        num_guardians:[6],
        activities:[
            {nombre_acticvidad: "Corona del Dolor", modificadores: [{"Flawless":true , "Prestigio":false}]},
            {nombre_acticvidad: "Asote del Pasado", modificadores: [{"Flawless":true , "Prestigio":false}]},
            {nombre_acticvidad: "Ultimo Deseo", modificadores: [{"Flawless":true , "Prestigio":false}]},
            {nombre_acticvidad: "Calus", modificadores: [{"Flawless":false , "Prestigio":true}]},
            {nombre_acticvidad: "Espira de Estrellas", modificadores: [{"Flawless":false , "Prestigio":true}]},
            {nombre_acticvidad: "Argos", modificadores: [{"Flawless":false , "Prestigio":true}]}
        ]
    }

]

app.get('/', (req, res) => {
    res.send('Revenants LFG APP !!');
});

app.get('/api/lfgs', (req, res) => {
    res.send(lfgs);
});

app.get('/api/lfgs_types', (req, res) => {
    res.send(lfgs_types);
});

app.get('/api/lfgs/:id', (req, res) => {
    const lfg = lfgs.find(l => l.id === parseInt(req.params.id)); 
    // We can also use let (define a veriable to reset later) or var (same as let)
    //if not found return 404
    if (!lfg) return res.status(404).send('LFG not found');
    res.send(lfg);
    
});

app.get('/api/lfgs_types/:id', (req, res) => {
    const lfg_type = lfgs_types(l => l.id === parseInt(req.params.id)); 
    // We can also use let (define a veriable to reset later) or var (same as let)
    //if not found return 404
    if (!lfg_type) return res.status(404).send('LFG not found');
    res.send(lfg_type);
    
});


app.post('/api/lfgs', (req, res) => {
    
    const { error } = validateLFG(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const lfg = {
        id: lfgs.length +1,
        creator_id: req.body.creator_id,
        creator_btag: req.body.creator_btag,
        activity: req.body.activity,
        date: req.body.date,
        time: req.body.time,
        time_zone: req.body.time_zone
    };

    lfgs.push(lfg);
    res.send(lfg);
});


app.post('/api/lfgs_types', (req, res) => {
    
    const { error } = validateLFGType(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const lfg_type = {
        id: lfgs_types.length +1,
        name: req.body.name,
        num_guardians:req.body.num_guardians,
        activities: req.body.activities
    };

    lfgs_types.push(lfg_type);
    res.send(lfg_type);
});


app.put('/api/lfgs/:id', (req, res) => {
    //Lookup LFG with id
    //Not found 404
    const lfg = lfgs.find(l => l.id === parseInt(req.params.id)); 
    if (!lfg) return res.status(404).send('LFG not found');
    
    //Validate
    //Not valid 400
    //const result = validateLFG(req.body);
    const { error } = validateLFG(req.body); // Same as above but i only need error property

    //if (result.error) return res.status(400).send(result.error.details[0].message);
    if (error) return res.status(400).send(error.details[0].message);

    //Udate LFG
    // Return updated LFG
    //lfg.name = req.body.name;
    lfg.creator_id = req.body.creator_id;
    lfg.creator_btag = req.body.creator_btag;
    lfg.activity = req.body.activity;
    lfg.date = req.body.date;
    lfg.time = req.body.time;
    lfg.time_zone = req.body.time_zone;
    res.send(lfg);
});


app.put('/api/lfgs_types/:id', (req, res) => {
    //Lookup LFG with id
    //Not found 404
    const lfg_type = lfgs_types.find(l => l.id === parseInt(req.params.id)); 
    if (!lfg_type) return res.status(404).send('LFG not found');
    
    //Validate
    //Not valid 400
    //const result = validateLFG(req.body);
    const { error } = validateLFGType(req.body); // Same as above but i only need error property

    //if (result.error) return res.status(400).send(result.error.details[0].message);
    if (error) return res.status(400).send(error.details[0].message);

    //Udate LFG
    // Return updated LFG
    //lfg_type.name = req.body.name;
    //TODO
    res.send(lfg_type);
});

app.delete('/api/lfgs/:id', (req, res) => {
    //Find lfg
    //Not Exists 404
    const lfg = lfgs.find(l => l.id === parseInt(req.params.id)); 
    if (!lfg) return res.status(404).send('LFG not found');

    //Delete
    const index = lfgs.indexOf(lfg);
    lfgs.splice(index,1);

    //Return the lfg
    res.send(lfg);
});


function validateLFG(lfg){
    const schema = {
        creator_id: Joi.string().min(1),
        creator_btag: Joi.string().min(3),
        activity: Joi.string().required(),
        date: Joi.date().min('1-10-2019').iso(),
        time: Joi.string().min(3),
        time_zone: Joi.string().min(3)
    };
    return Joi.validate(lfg, schema);
};


function validateLFGType(lfg_type){
    const schema = {
        name: Joi.string().min(3).required(),
        num_guardians: Joi.array().items(Joi.number().integer().min(2).max(6).required()),
        activities: Joi.array().required().items(Joi.object({
            nombre_acticvidad: Joi.string().min(3).required(),
            Niveles: Joi.array().items(Joi.string().min(3)),
            modificadores: Joi.array().items(Joi.object({
                Prestigio: Joi.boolean(),
                Flawless: Joi.boolean()
            }))
        }))
    };
    return Joi.validate(lfg_type, schema);
};


// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port} dude ...`));