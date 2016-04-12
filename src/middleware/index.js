// Add a requiresLogin function that checks if we attached an account to their session and redirects to the homepage if not.
var requiresLogin = function (req, res, next) {
    if (!req.session.account) {
        return res.redirect('/');
    }

    next();
}

// add a requiresLogout function that checks if the user is already logged in (we attached an account to their session) and redirects them to the app if so.
var requiresLogout = function (req, res, next) {
    if (req.session.account) {
        return res.redirect('/game');
    }

    next();
}

// we will check to see if the forwarded request (through Heroku) was secure by checking the request’s “x-forwarded-proto” header.
var requiresSecure = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] != 'https') {
        return res.redirect('https://' + req.hostname + req.url);
    }

    next();
}

// For local development/testing, we can’t easily run HTTPS, so instead we will just bypass the check.
var bypassSecure = function (req, res, next) {
    next();
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// How do we know if we are on Heroku or not? Environment variables!
if (process.env.NODE_ENV === "production") {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}