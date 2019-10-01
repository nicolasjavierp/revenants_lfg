const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const generalDebugger = require('debug')('app:general');


//DB SCHEMA !!!
const lfgs_Schema = new mongoose.Schema({
    creator_id: {type: String, required: true},// Coding exclusive to Mongoose
    creator_btag: {type: String, required: true},
    activity: {type: String, required: true},
    /*
    activity: {
        type: String,
        required: true,
        enum: ['Ocaso', 'Asalto', 'Mision']
    },
    */
    //date_time: {type: Date("<YYYY-mm-ddTHH:MM:ssZ>"), default:Date("<YYYY-mm-ddTHH:MM:ssZ>").now},
    date_time: {type: Date, default:Date.now},
    time_zone: String,
    participants: [ String ]
    /*
    isValid: Boolean,
    publish: {
        type: String,
        required: function(){return this.isValid} // wil be published if lfg isValid
    }
    */
});

const LFG = mongoose.model('LFGS',lfgs_Schema);

router.get('/', async (req, res) => {
    const lfgs = await LFG.find().sort('date_time');
    res.send(lfgs);
});

router.get('/:id', async (req, res) => {
    const lfg = await LFG.findById(req.params.id);
    if (!lfg) return res.status(404).send('LFG not found');
    res.send(lfg);
});

router.post('/', async (req, res) => {
    const { error } = validateLFG(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let lfg = new LFG({
        creator_id: req.body.creator_id,
        creator_btag: req.body.creator_btag,
        activity: req.body.activity,
        date: req.body.date,
        time: req.body.time,
        time_zone: req.body.time_zone,
        participants: req.body.participants
    });
    lfg = await lfg.save();
    res.send(lfg);
});

router.put('/:id', async (req, res) => {
    const { error } = validateLFG(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const lfg = await LFG.findByIdAndUpdate(req.params.id, {
        creator_id : req.body.creator_id,
        creator_btag : req.body.creator_btag,
        activity : req.body.activity,
        date : req.body.date,
        time : req.body.time,
        time_zone : req.body.time_zone,
        participants: req.body.participants
    }, {new: true})

    if (!lfg) return res.status(404).send('LFG not found');
    res.send(lfg);
});

router.delete('/:id', async (req, res) => {
    const lfg = await LFG.findByIdAndRemove(req.params.id);
    if (!lfg) return res.status(404).send('LFG not found');
    res.send(lfg);
});

function validateLFG(lfg){
    const schema = {
        creator_id: Joi.string().min(1),
        creator_btag: Joi.string().min(3),
        activity: Joi.string().required(),
        date: Joi.date().min('1-10-2019').iso(),
        time: Joi.string().min(3),
        time_zone: Joi.string().min(3),
        participants: Joi.array().items(Joi.string())
    };
    return Joi.validate(lfg, schema);
};

module.exports = router;