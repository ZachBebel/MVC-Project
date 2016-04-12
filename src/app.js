//import libraries 
var path = require('path'); //path is a built-in node library to handle file system paths
var express = require('express'); //express is a popular Model-View-Controller framework for Node
var compression = require('compression'); //compression library to gzip responses for smaller/faster transfer
var favicon = require('serve-favicon'); //favicon library to handle favicon requests
var cookieParser = require('cookie-parser'); //Library to parse cookies from the requests
var bodyParser = require('body-parser'); //library to handle POST requests any information sent in an HTTP body
var mongoose = require('mongoose'); //Mongoose is one of the most popular MongoDB libraries for node
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');

// Csurf is a middleware library which automatically generates unique tokens for each user for each page. It then checks for those tokens on requests to prevent forgery from another page.
var csrf = require('csurf');

//In MVC, you have 'routes' that line up URLs to controller methods
var router = require('./router.js'); //import our router.js file to handle the MVC routes

//MONGODB address to connect to.
//process.env.MONGOLAB_URI is the variable automatically put into your node application by Heroku is you are using mongoLab
//otherwise fallback to localhost. The string after mongodb://localhost is the database name. It can be anything you want. 
var dbURL = process.env.MONGOLAB_URI || "mongodb://heroku_7b4nq9bd:nh1af4q8i55faph8vgl0p2fmvf@ds059155.mlab.com:59155/heroku_7b4nq9bd";

//call mongoose's connect function and pass in the url. If there are any errors connecting, we will throw it and kill the server. 
//Once connected, the mongoose package will stay connected for every file that requires it in this project
var db = mongoose.connect(dbURL, function (err) {
    if (err) {
        console.log("Could not connect to database");
        throw err;
    }
});

// REDISCLOUD_URL = "redis://rediscloud:password@localhost:6379"
var redisURL = {
    hostname: 'localhost',
    port: 6379
}

var redisPASS;

if (process.env.REDISCLOUD_URL) {
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    redisPASS = redisURL.auth.split(":")[1];
} else {
    //redisURL = url.parse("redis://rediscloud:AbFGEKH6HfbXGBB2@pub-redis-11899.us-east-1-4.4.ec2.garantiadata.com:11899");
    //redisPASS = redisURL.auth.split(":")[1];
}

//Port set by process.env.PORT environment variable.
//If the process.env.PORT variable or the env.NODE_PORT variables do not exist, use port 3000    
var port = process.env.PORT || process.env.NODE_PORT || 3000;

//call express to get an Express MVC server object
var app = express();

//app.use tells express to use different options
//This option tells express to use /assets in a URL path as a static mirror to our client folder
//Any requests to /assets will map to the client folder to find a file
//For example going to /assets/img/favicon.png would return the favicon image
app.use('/assets', express.static(path.resolve(__dirname + '/../client/')));

//Call compression and tell the app to use it
app.use(compression());

// parse form POST requests as application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json body requests. These are usually POST requests or requests with a body parameter in AJAX
//Alternatively, this might be a web API request from a mobile app, another server or another application
app.use(bodyParser.json());

// The key is the name of your cookie so that it can be tracked in requests
// The secret is a private string used as a seed for hashing/creating unique session keys. This makes it so your unique session keys are different from other servers using express.
// The resave option just tells the session module to refresh the key to keep it active.
// The saveUninitialized option just tells the module to always make sessions even when not logged in. This automatically generates each user a session key instead of having you manually make them.
app.use(session({
    key: 'sessionid',
    store: new RedisStore({
        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisPASS
    }),
    secret: 'MVC is your friend',
    resave: true,
    saveUninitialized: true,
    // send a flag with the session cookie telling the browser to disallow JS access to the cookies
    cookie: {
        httpOnly: true
    }
}));

//app.set sets one of the express config options
//set up the view (V of MVC) to use jade (not shown in this example but needed for express to work)
//You can use other view engines besides jade
app.set('view engine', 'jade');

//set the views path to the template directory (not shown in this example but needed for express to work)
app.set('views', __dirname + '/views');

//call favicon with the favicon path and tell the app to use it
app.use(favicon(__dirname + '/../client/img/favicon.png'));

//disable header to hide server framework
app.disable('x-powered-by');

//call the cookie parser library and tell express to use it
app.use(cookieParser());

// before you setup the router, we need to add CSurf (which we called csrf). CSurf will generate a unique token for each request and requests from the same session must match. If they don’t, csurf will create an err called ‘EBADCSRFTOKEN’
app.use(csrf());
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    } else {
        console.log("Incorrect csurf token");
    }
    return; // if error, do not process the request
});

//pass our app to our router object to map the routes
router(app);

//Tell the app to listen on the specified port
var server = app.listen(port, function (err) {
    //if the app fails, throw the err 
    if (err) {
        throw err;
    }
    console.log('Listening on port ' + port);
});