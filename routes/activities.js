const {Activity, validate} = require('../models/Activity'); 
const express = require('express');
const router = express.Router();
const generalDebugger = require('debug')('app:general');


router.get('/', async (req, res) => {
    const activities = await Activity.find().sort('category');
    res.send(activities);
});

router.get('/:id', async (req, res) => {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).send('Activity not found');
    res.send(activity);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //generalDebugger(req.body);
    let activity = new Activity({
        category: req.body.category,
        activity: req.body.activity
    });
    activity = await activity.save();
    res.send(activity);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const activity = await Activity.findByIdAndUpdate(req.params.id, {
        name : req.body.name,
        activities : req.body.activities
    }, {new: true})

    if (!activity) return res.status(404).send('Activity not found');
    res.send(activity);
});


router.delete('/:id', async (req, res) => {
    const activity = await Activity.findByIdAndRemove(req.params.id);
    if (!activity) return res.status(404).send('Activity not found');
    res.send(activity);
});

module.exports = router;