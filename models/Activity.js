const Joi = require('joi');
const mongoose = require('mongoose');


//DB SCHEMA !!!
const activity_Schema = new mongoose.Schema({
    category: {
        type: String,
        enum: ["Vanguardia","Crisol", "Gambito", "Raid", "Misiones" ],
        required: true
    },
    activity: {
        activity_name: {type: String, required :true},
        num_guardians: {type: [Number], required: true},
        data: Object
    }
});

const Activity = mongoose.model('Activities',activity_Schema);

function validateActivity(Activity){
    const schema = {
        category: Joi.string().min(3).required(),
        activity: Joi.object({
            activity_name: Joi.string().min(3).required(),
            num_guardians: Joi.array().items(Joi.number().integer().min(2).max(6).required()),
            data: Joi.object()
        })
    };
    return Joi.validate(Activity, schema);
};


exports.Activity = Activity;
exports.validate = validateActivity;


