const Joi = require('joi');
const mongoose = require('mongoose');


//DB SCHEMA !!!
const lfgs_types_Schema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["Vanguardia","Crisol", "Gambito", "Raid", "Misiones" ],
        required: true
    },
    activities: {
        nombre_actividad: {type: String, required :true},
        num_guardians: {type: [Number], required: true},
        data: Object
    }
});

const LFG_TYPE = mongoose.model('LFGS_TYPES',lfgs_types_Schema);

function validateLFGType(lfg_type){
    const schema = {
        name: Joi.string().min(3).required(),
        //activities: Joi.array().required().items(Joi.object({
        activities: Joi.object({
            nombre_actividad: Joi.string().min(3).required(),
            num_guardians: Joi.array().items(Joi.number().integer().min(2).max(6).required()),
            data: Joi.object()
        })
    };
    return Joi.validate(lfg_type, schema);
};


exports.LFG_TYPE = LFG_TYPE;
exports.validate = validateLFGType;