//require mongoose, a popular MongoDB library for nodejs
//Mongoose connects in the app.js file. Once mongoose is connected, it stays connected across all of the files in this project
//As long as you import this after you have connected, then mongoose will give you the active DB connection which is what we want
var mongoose = require('mongoose');
var _ = require('underscore');

//variable to hold our Model
//A Model is our data structure to handle data. This can be an object, JSON, XML or anything else. 
//A mongoDB model is a Mongo database structure with the API attached
//That is, a model has built-in functions for its data structure like find, findOne, etc. 
//Usually you will retrieve data from the database through the Model object
var ScoreModel;

//A DB Schema to define our data structure
//The schema really just defines a DB data structure. 
//In this case it also defines what functions/methods will be attached to objects that come 
//back from the database. 
//Schemas also add constraints to the fields so that you can enforce that objects have fields of the right type
//This should always be done since it ensures your variables will be the right type and 
//it helps prevent injection of invalid data
//Schemas are made in JSON.
//The name of the field will be the variable name for each object
//The json of each field are the constraints around it
//There are many constraints available 
//For example, 
//type is the data type (String, Number, Date, Boolean, etc).
//required is whether or not the field is required to allow a document to be created
//trim is whether or not the field should strip spaces before and after value
//unique is whether or not the field must be a unique value (meaning no two Cat object can have the same value for that field)
//min is the minimum numeric value
//max is the maximum numeric value
//default is the default value if one is not provided
//match is the format to match done through regex
var ScoreSchema = new mongoose.Schema({

    score: {
        type: Number,
        min: 0,
        required: true
    },

    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    },

    username: {
        type: String,
        required: true,
        trim: true,
        match: /^[A-Za-z0-9_\-\.]{1,16}$/
    },

    createdData: {
        type: Date,
        default: Date.now
    }

});

//Schema.statics are static methods attached to the Model or objects
//These DO NOT have their own instance. They are all the static function. They do not look at
//individual instance variables since there is no instance of them. Every static function
//only exists once and is called.
//In this case, findByName will be attached to the model and objects.
//They will be able to call this function, but they won't be able to reference any instance variables of that object (or at least accurately)
//These are used when you want a public function you can call to do a task, not a method that uses or returns instance variables
//That is, these are used when you don't need an object, just a function to call.
ScoreSchema.statics.findAllByUser = function (userId, callback) {

    var search = {
        user: mongoose.Types.ObjectId(userId)
    };

    return ScoreModel.find(search).select("score username createdData").sort({
        createdData: 'descending'
    }).exec(callback);
};

ScoreSchema.statics.findHighestByUser = function (userId, callback) {

    var search = {
        user: mongoose.Types.ObjectId(userId)
    };

    return ScoreModel.find(search).select("score username createdData").sort({
        score: 'descending'
    }).limit(1).exec(callback);
};

ScoreSchema.statics.findAllUsers = function (callback) {
    /*
    var search = {
        user: {
            $exists: true
        }
    };
    */
    return ScoreModel.distinct('user').exec(callback);
};

/*
ScoreSchema.statics.findAllHighest = function (callback) {

    ScoreSchema.statics.findAllUsers(function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        // Get highscore for each user with a score
        var scores = [];
        var user;
        for (var i = 0; i < docs.length; i += 1) {

            user = docs[i];

            // Get highscore
            ScoreSchema.statics.findHighestByUser(user, function (err, docs) {

                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        err: err
                    }); //if error, return it
                }

                scores.push(docs);
                console.log("User " + user + ": " + docs);
            });

        };

        console.log(scores);
    });

    return ScoreModel.distinct('user').exec(callback);
};
*/

//Create the score model based on the schema. You provide it with a custom discriminator (the name of the object type. Can be anything)
//and the schema to make a model from.
//Look at the model variable definition above for more details.
ScoreModel = mongoose.model('Score', ScoreSchema);

//export our public properties
module.exports.ScoreModel = ScoreModel;
module.exports.ScoreSchema = ScoreSchema;