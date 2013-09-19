/**
 * Allow any authenticated user.
 */
var passport = require('passport');
module.exports = function (req, res, next)
{
	// User is allowed, proceed to controller
	var is_auth = req.isAuthenticated()
	if (is_auth)
	{
		return next();
	}
	// User is not allowed
	else
	{
		passport.authenticate('basic',
		{
			session: true
		}, function (err, user, info)
		{
			if ((err) || (!user))
			{
				if (req.isJSON || req.isAJAX)
				{
					return res.send(err);
					return res.send(
					{
						message: 'login failed'
					});
				}
				else
					return res.redirect("/");
			}
			req.logIn(user, function (err)
			{
				if (err) res.send(err);
				return next();
			});
		})(req, res);
	}
};

// /**
//  * Allow any authenticated user.
//  */
// module.exports = function (req, res, ok) {

//   // User is allowed, proceed to controller
//   if (req.session.authenticated) {
//     return ok();
//   }

//   // User is not allowed
//   else {
//     return res.send("You are not permitted to perform this action.", 403);
//   }
// };
/**
 * api/policies/authenticated.js
 *
 * This example shows how to use the HTTP Basic authentication strategy using the passport-http module.
 * Other strategies (Digest, OAuth, OAuth2, etc) can be similarly implemented.
 *
 **/
// var express = require('express'),
//  app = express(),
//  passport = require('passport'),
//  local = require('../../config/local');

// app.use(passport.initialize());

// /**
//  * Allow any authenticated user.
//  */
// module.exports = function (req, res, ok)
// {
//  // User is allowed, proceed to controller
//  passport.authenticate(local.auth,
//  {
//    session: false
//  }, function (err, user, info)
//  {
//    if (err || !user)
//    {
//      return res.send("You are not permitted to perform this action.", 403);
//    }
//    return ok();
//  })(req, res, ok);
// };