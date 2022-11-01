const { isEmpty } = require("lodash");
const { Exercise } = require("./model");
const moment = require('moment');

// POST /api/users

const createUser = async (req,res) => {
    try {
    let { username = ''} = req.body || {};
    let userData = await Exercise.findOne({ username }) || {}
    
    //if incoming username is not present in db creating new entry
    if(isEmpty(userData)){
        let updateQuery = new Exercise({ username })
        let updatedData = await updateQuery.save()
        let { _id = ''} = updatedData || {}
        return res.json({
            "username":username,
            "_id":_id
        })
    }else { //if incoming username is present in db just sending the data without saving it again
        let { _id = ''} = userData || {};
        return res.json({
            "username":username,
            "_id":_id
        })
    }
    }
    catch(error){
        console.log(`Error while creating user. Error: ${error}`);
        return;
    }
    
}


//POST /api/users/:_id/exercises
const createExercise = async (req,res) => {
let { description = '', duration = '', date = ''} = req.body || {}
let _id = req.params._id || '';

try {
    let userData = await Exercise.findById({ _id }) || {};
    if(!Number(duration)){
        return res.json({
            error:'Duration should be a valid integer'
        })
    }
    if(isEmpty(userData)){
        return res.json({
            error:'No user found for the given Id'
        })
    } 
    if(isEmpty(date)){
        date = new Date().toDateString();
    }
    if(new Date(date) == 'Invalid Date'){
        return res.json({
            error:'Invalid date format'
        })
    }
    
    
    let { username = '', log = [] } = userData || {};
    let updateQuery = {
        description,
        duration: duration && Number(duration),
        date: date && new Date(date).toDateString()
    }
    let updatedData = await Exercise.updateOne({ _id },{ $push: { log: updateQuery}})
    return res.json({
        _id,
        username,
        date: date && new Date(date).toDateString(),
        duration:duration && Number(duration),
        description
    })
    
} catch (error) {
    console.log(`Error while creating new excercise. Error: ${error}`);
    return;
}

}

// /api/users
const getAllUsers = async (req,res) => {
try {
    let data = await Exercise.find({},{username:1,_id:1})
    return res.send(data)
}
catch(error){
    console.log(`Error while fetching all user data. Error: ${error}`);
    return;
}
}

// /api/users/:_id/logs

const getExerciseDetails = async (req,res) => {
    let _id = req.params._id || '';
    let limit = req.query.limit || '';
    let from = req.query.from || '';
    let to = req.query.to || ''
    console.log(limit,'--',from,'**',to)
    try {
        let excerciseData = await Exercise.findOne({ _id }) || {};
        let { username = '', log = []} = excerciseData;
        let newLogArray = [];
        log.map((item)=>{
            newLogArray.push({
                "description":item.description,
                "duration":item.duration,
                "date":item.date
            })
        })

        let finalLogArray = newLogArray;

        if(!isEmpty(from) && !isEmpty(to)){
            let startDate = new Date(from);
            let endDate = new Date(to);
            finalLogArray = finalLogArray.filter(a => {
                let date = new Date(a.date);
                // console.log(date)
                // return (date >= startDate && date < endDate);
                return moment(date).isBetween(startDate,endDate);
              });
        }
        
        if(!isEmpty(limit)){
            let numLimit = Number(limit);
            finalLogArray = finalLogArray.slice(0,numLimit)
        }

        return res.json({
            _id,
            username,
            "count":finalLogArray.length,
            "log":finalLogArray
        })
    } catch (error) {
        console.log(`Error while fetching excercise details. Error: ${error}`);
        return;
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getExerciseDetails,
    createExercise
}