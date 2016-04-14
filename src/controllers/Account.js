var path = require('path'); //path is a built-in node library to handle file system paths
var models = require('../models'); //pull in our models. This will automatically load the index.js from that folder

var Account = models.Account;

var loginPage = function (req, res) {
    res.render('login', {
        csrfToken: req.csrfToken()
    });
}

var signupPage = function (req, res) {
    res.render('signup', {
        csrfToken: req.csrfToken()
    });
}

var logout = function (req, res) {
    // The destroy function will remove a user’s session. We call this on logout so that our server knows they are no longer logged in.
    req.session.destroy();
    res.redirect('/');
}

var login = function (req, res) {
    //check if the required fields exist
    //normally you would also perform validation to know if the data they sent you was real 
    if (!req.body.username || !req.body.pass) {
        //if not respond with a 400 error (either through json or a web page depending on the client dev)
        return res.status(400).json({
            error: "All fields required"
        });
    }

    Account.AccountModel.authenticate(req.body.username, req.body.pass, function (err, account) {

        if (err || !account) {
            console.log(err);
            return res.status(401).json({
                err: "Incorrect username or password"
            }); //if error, return it
        }

        // When a user logs in, we will attach all of the fields from toAPI to their session for tracking.
        req.session.account = account.toAPI();

        //return success
        res.json({
            redirect: '/tracker'
        });

    });

}

var signup = function (req, res) {
    //check if the required fields exist
    //normally you would also perform validation to know if the data they sent you was real 
    if (!req.body.username || !req.body.pass || !req.body.pass2) {
        //if not respond with a 400 error (either through json or a web page depending on the client dev)
        return res.status(400).json({
            error: "All fields required"
        });
    }

    // Also check for matching passwords
    if (req.body.pass !== req.body.pass2) {
        //if not respond with a 400 error (either through json or a web page depending on the client dev)
        return res.status(400).json({
            error: "Passwords do not match"
        });
    }

    Account.AccountModel.generateHash(req.body.pass, function (salt, hash) {

        //dummy JSON to insert into database
        var accountData = {
            username: req.body.username,
            salt: salt,
            password: hash
        };

        //create a new object of AccountModel with the object to save
        var newAccount = new Account.AccountModel(accountData);

        //Save the newAccount object to the database
        newAccount.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    err: err
                }); //if error, return it
            }

            // Since the user is signing up and being logged in automatically, we need to duplicate the account data in the session just like they had logged in.
            req.session.account = newAccount.toAPI();

            //return success
            res.json({
                redirect: '/tracker'
            });
        });

    });
}

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;