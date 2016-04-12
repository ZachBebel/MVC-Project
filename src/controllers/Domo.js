var _ = require('underscore');
var models = require('../models');

var Domo = models.Domo;

var makerPage = function (req, res) {

    Domo.DomoModel.findByOwner(req.session.account._id, function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.render('app', {
            csrfToken: req.csrfToken(),
            domos: docs
        });

    });
}

var makeDomo = function (req, res) {
    //check if the required fields exist
    //normally you would also perform validation to know if the data they sent you was real 
    if (!req.body.name || !req.body.age || !req.body.bloodType) {
        //if not respond with a 400 error (either through json or a web page depending on the client dev)
        return res.status(400).json({
            error: "RAWR! All fields required!"
        });
    }

    //dummy JSON to insert into database
    // Notice for the Domo owner field, we put the ID of the owner we stored in req.session from the Account Model’s toAPI method. This is the nice value of storing a user’s data in their session. We can access the session anywhere we can access the request.
    var domoData = {
        name: req.body.name,
        age: req.body.age,
        bloodType: req.body.bloodType,
        owner: req.session.account._id
    };

    //create a new object of DomoModel with the object to save
    var newDomo = new Domo.DomoModel(domoData);

    //Save the newAccount object to the database
    newDomo.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.json({
            redirect: '/maker'
        });
    });
}

var deleteDomo = function (req, res) {

    //dummy JSON to find the specific doc in the database
    // Notice for the Domo owner field, we put the ID of the owner we stored in req.session from the Account Model’s toAPI method. This is the nice value of storing a user’s data in their session. We can access the session anywhere we can access the request.
    var domoData = {
        name: req.body.name,
        age: req.body.age,
        bloodType: req.body.bloodType,
        owner: req.session.account._id
    };

    //Domo.DomoModel.remove(domoData);

    //Delete the domo from the database
    Domo.DomoModel.findOneAndRemove(domoData, function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.json({
            redirect: '/maker'
        });
    });
}

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.delete = deleteDomo;