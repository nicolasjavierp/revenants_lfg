const express = require('express');
const router = express.Router();
const Joi = require('joi');

//DB SCHEMA !!!
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


router.get('/', (req, res) => {
    res.send(lfgs_types);
});

router.get('/:id', (req, res) => {
    const lfg_type = lfgs_types(l => l.id === parseInt(req.params.id)); 
    // We can also use let (define a veriable to reset later) or var (same as let)
    //if not found return 404
    if (!lfg_type) return res.status(404).send('LFG not found');
    res.send(lfg_type);
    
});

router.post('/', (req, res) => {
    
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

router.put('/:id', (req, res) => {
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
    lfg_type.name = req.body.name;
    lfg_type.num_guardians = req.body.num_guardians;
    lfg_type.activities = req.body.activities;
    res.send(lfg_type);
});

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


module.exports = router;