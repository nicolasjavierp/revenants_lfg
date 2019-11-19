const {LFG, validate} = require('../models/LFG');
//const {Activity} = require('../models/Activity'); 
const express = require('express');
const router = express.Router();

const generalDebugger = require('debug')('app:general');

router.get('/', async (req, res) => {
    //const lfgs = await LFG.find().sort('date_time');
    const lfgs = await LFG.find().populate('activity_info').sort('date_time');
    res.send(lfgs);
});

router.get('/:id', async (req, res) => {
    const lfg = await LFG.findById(req.params.id);
    if (!lfg) return res.status(404).send('LFG not found');
    res.send(lfg);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let lfg = new LFG({
        creator_id: req.body.creator_id,
        creator_btag: req.body.creator_btag,
        activity_info: req.body.activity_info,
        date: req.body.date,
        time: req.body.time,
        time_zone: req.body.time_zone,
        participants: req.body.participants
    });
    lfg = await lfg.save();
    res.send(lfg);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const lfg = await LFG.findByIdAndUpdate(req.params.id, {
        creator_id : req.body.creator_id,
        creator_btag : req.body.creator_btag,
        activity_info : req.body.activity_info,
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

module.exports = router;