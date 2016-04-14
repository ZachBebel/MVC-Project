//import the controllers
//This only specifies the folder name, which means it will automatically pull the index.js file
var controllers = require('./controllers');
var mid = require('./middleware');

//function to attach routes
var router = function (app) { //pass the express app in

    //app.VERB maps get requests to a middleware action
    //For example
    //app.get handles GET requests
    //app.post handles POST requests

    //when someone goes to the /page1 page, call controllers.page1
    //For example, www.webpage.com/page1, it will route to controllers.page1

    // The way router level middleware in Express works is you connect as many middleware calls as you want in the order you want the middleware to run. The first parameter is always the URL. The last parameter is always the controller. Everything in between is any of the middleware operations you want to call.

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);
    app.get('/tracker', mid.requiresLogin, controllers.Score.trackerPage);
    app.post('/tracker', mid.requiresLogin, controllers.Score.addScore);
    app.get('/scores', mid.requiresLogin, controllers.Score.scoresPage);
    app.get('/leaderboard', controllers.Score.leaderboardPage);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

};

//export the router function
module.exports = router;