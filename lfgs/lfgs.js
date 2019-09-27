const express = require('express');
const router = express.Router();
const Joi = require('joi');

//DB SCHEMA !!!
const lfgs = [
    {id: 1, creator_id: '1', creator_btag:'Javu#2632', activity: 'Calus', date: ' ',time: ' ', time_zone: ' '},
    {id: 2, creator_id: '1', creator_btag:'Javu#2632', activity: 'Last Wish', date: ' ',time: ' ', time_zone: ' '},
    {id: 3, creator_id: '1', creator_btag:'Javu#2632', activity: 'Corona del Dolor', date: ' ',time: ' ', time_zone: ' '}
]

router.get('/', (req, res) => {
    res.send(lfgs);
});

router.get('/:id', (req, res) => {
    const lfg = lfgs.find(l => l.id === parseInt(req.params.id)); 
    // We can also use let (define a veriable to reset later) or var (same as let)
    //if not found return 404
    if (!lfg) return res.status(404).send('LFG not found');
    res.send(lfg);
    
});

router.post('/', (req, res) => {
    
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;