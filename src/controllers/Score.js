var _ = require('underscore');
var models = require('../models');

var Score = models.Score;

var trackerPage = function (req, res) {

    /*
    // Clear database
    Score.ScoreModel.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('success');
        }
    });
    */

    Score.ScoreModel.findAllByUser(req.session.account._id, function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //return success
        res.render('tracker', {
            csrfToken: req.csrfToken(),
            username: req.session.account.username,
            scores: docs
        });

    });
}

var scoresPage = function (req, res) {

    Score.ScoreModel.findAllByUser(req.session.account._id, function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        //console.log(docs);

        //return success
        res.render('scores', {
            csrfToken: req.csrfToken(),
            username: req.session.account.username,
            scores: docs
        });

    });
}

var leaderboardPage = function (req, res) {

    Score.ScoreModel.findAllUsers(function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        // Check if logged in
        var username = "";
        if (req.session.account) {
            username = req.session.account.username;
        }

        // Get highscore for each user with a score
        var scores = [];
        var users = docs;
        var index = 0;

        function loop() {
            if (index < users.length) {

                // Get highscore
                Score.ScoreModel.findHighestByUser(users[index], function (err, docs) {

                    if (err) {
                        console.log(err);
                        return res.status(400).json({
                            err: err
                        }); //if error, return it
                    }

                    scores.push(docs[0]);
                    //console.log("User " + users[index] + ": " + docs);

                    // Get next highscore async
                    index += 1;
                    loop();
                });

            } else {

                //console.log(scores);

                // Sort scores highest to lowest
                scores.sort(function (a, b) {
                    if (a.score > b.score) {
                        return -1;
                    } else if (a.score < b.score) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                // Render page
                res.render('leaderboard', {
                    csrfToken: req.csrfToken(),
                    username: username,
                    scores: scores
                });
            }
        }

        loop();

    });

    /*
    Score.ScoreModel.findAllHighest(function (err, docs) {

        if (err) {
            console.log(err);
            return res.status(400).json({
                err: err
            }); //if error, return it
        }

        // Check if logged in
        var username = "Guest";
        if (req.session.account) {
            username = req.session.account.username;
        }

        //return success
        res.render('leaderboard', {
            csrfToken: req.csrfToken(),
            username: username,
            scores: docs
        });

    });
    */
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
        user: req.session.account._id,
        username: req.session.account.username
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

module.exports.trackerPage = trackerPage;
module.exports.scoresPage = scoresPage;
module.exports.leaderboardPage = leaderboardPage;
module.exports.addScore = addScore;