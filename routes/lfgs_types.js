const {LFG_TYPE, validate} = require('../models/LFG_TYPE'); 
const express = require('express');
const router = express.Router();
const generalDebugger = require('debug')('app:general');


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
    const { error } = validate(req.body);
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
    const { error } = validate(req.body);
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

module.exports = router;