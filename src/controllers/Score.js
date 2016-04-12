var _ = require('underscore');
var models = require('../models');

var Score = models.Score;

var gamePage = function (req, res) {

    Score.ScoreModel.findByUser(req.session.account._id, function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.render('game', {
            csrfToken: req.csrfToken(),
            scores: docs
        });

    });
}

var scoresPage = function (req, res) {

    Score.ScoreModel.findByUser(req.session.account._id, function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.render('scores', {
            csrfToken: req.csrfToken(),
            scores: docs
        });

    });
}

var leaderboardPage = function (req, res) {

    Score.ScoreModel.findByUser(req.session.account._id, function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.render('leaderboard', {
            csrfToken: req.csrfToken(),
            scores: docs
        });

    });
}

var addScore = function (req, res) {
    //check if the required fields exist
    //normally you would also perform validation to know if the data they sent you was real 
    if (!req.body.score) {
        //if not respond with a 400 error (either through json or a web page depending on the client dev)
        return res.status(400).json({
            error: "All fields required!"
        });
    }

    //dummy JSON to insert into database
    // Notice for the Score user field, we put the ID of the user we stored in req.session from the Account Model’s toAPI method. This is the nice value of storing a user’s data in their session. We can access the session anywhere we can access the request.
    var scoreData = {
        score: req.body.score,
        user: req.session.account._id
    };

    //create a new object of ScoreModel with the object to save
    var newScore = new Score.ScoreModel(scoreData);

    //Save the newScore object to the database
    newScore.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.json({
            redirect: '/scores'
        });
    });
}

var deleteScore = function (req, res) {

    //dummy JSON to find the specific doc in the database
    // Notice for the Score user field, we put the ID of the user we stored in req.session from the Account Model’s toAPI method. This is the nice value of storing a user’s data in their session. We can access the session anywhere we can access the request.
    var scoreData = {
        score: req.body.score,
        user: req.session.account._id,
        date: req.body.date
    };

    //Score.ScoreModel.remove(scoreData);

    //Delete the score from the database
    Score.ScoreModel.findOneAndRemove(scoreData, function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.json({
            redirect: '/scores'
        });
    });
}

module.exports.gamePage = gamePage;
module.exports.scoresPage = scoresPage;
module.exports.leaderboardPage = leaderboardPage;
module.exports.addScore = addScore;
module.exports.deleteScore = deleteScore;