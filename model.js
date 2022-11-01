const mongoose = require('mongoose');

const exercisechema = new mongoose.Schema({
    username:{
        type:String
    },
    log:[
        {
            description:String,
            duration:Number,
            date:String
        }

    ]
})

const Exercise = mongoose.model('Exercise', exercisechema);
module.exports = {
    Exercise
}