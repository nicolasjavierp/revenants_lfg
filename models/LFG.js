const Joi = require('joi');
const mongoose = require('mongoose');



//DB SCHEMA !!!
const lfgs_Schema = new mongoose.Schema({
    creator_id: {type: String, required: true},// Coding exclusive to Mongoose
    creator_btag: {type: String, required: true},
    //activity: {type: String, required: true},
    activity_info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activities'
    },
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


function validateLFG(lfg){
    const schema = {
        creator_id: Joi.string().min(1),
        creator_btag: Joi.string().min(3),
        activity_info: Joi.string().required(),
        date: Joi.date().min('1-10-2019').iso(),
        time: Joi.string().min(3),
        time_zone: Joi.string().min(3),
        participants: Joi.array().items(Joi.string())
    };
    return Joi.validate(lfg, schema);
};

exports.LFG = LFG;
exports.validate = validateLFG;