const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const generalDebugger = require('debug')('app:general');

//DB SCHEMA !!!
const lfgs_types_Schema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["Vanguardia","Crisol", "Gambito", "Raid", "Misiones" ],
        required: true
    },
    activities: [{
        nombre_acticvidad: {type: String, required :true},
        num_guardians: {type: [Number], required: true},
        data: Object
    }]
});

const LFG_TYPE = mongoose.model('LFGS_TYPES',lfgs_types_Schema);


router.get('/', async (req, res) => {
    const lfgs_types = await LFG_TYPE.find().sort('name');
    res.send(lfgs_types);
});

router.get('/:id', async (req, res) => {
    const lfg_type = await LFG_TYPE.findById(req.params.id);
    if (!lfg_type) return res.status(404).send('LFG_TYPE not found');
    res.send(lfg_type);
});

router.post('/', async (req, res) => {
    const { error } = validateLFGType(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //generalDebugger(req.body);
    let lfg_type = new LFG_TYPE({
        name: req.body.name,
        activities: req.body.activities
    });
    lfg_type = await lfg_type.save();
    res.send(lfg_type);
});

router.put('/:id', async (req, res) => {
    const { error } = validateLFG(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const lfg_type = await LFG_TYPE.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        activities : req.body.activities
    }, {new: true})

    if (!lfg_type) return res.status(404).send('LFG_TYPE not found');
    res.send(lfg_type);
});


router.delete('/:id', async (req, res) => {
    const lfg_type = await LFG_TYPE.findByIdAndRemove(req.params.id);
    if (!lfg_type) return res.status(404).send('LFG_TYPE not found');
    res.send(lfg_type);
});

function validateLFGType(lfg_type){
    const schema = {
        name: Joi.string().min(3).required(),
        activities: Joi.array().required().items(Joi.object({
            nombre_acticvidad: Joi.string().min(3).required(),
            num_guardians: Joi.array().items(Joi.number().integer().min(2).max(6).required()),
            data: Joi.object()
        }))
    };
    return Joi.validate(lfg_type, schema);
};


module.exports = router;