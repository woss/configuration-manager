/**
 * Allow any authenticated user.
 */
var passport = require('passport');
module.exports = function (req, res, next)
{
	// User is allowed, proceed to controller
	var is_auth = req.isAuthenticated()
    if (!is_auth) {
        passport.authenticate('basic',
            {
                session: true
            }, function (err, user, info) {
                if ((err) || (!user)) {
                    return req.isJson || req.isAjax ? res.json(
                        {
                            error: 403,
                            message: "U need to login"
                        }, 403) : res.redirect("/");

                }
                req.logIn(user, function (err) {
                    if (err) res.send(err);
                    return next();
                });
            })(req, res);
    } else return next();
};