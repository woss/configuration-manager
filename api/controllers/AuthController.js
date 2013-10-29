/**
 * AuthController
 *
 */
var passport = require('passport');
module.exports = {

	index: function (req, res)
	{
		var is_auth = req.isAuthenticated();
		if (is_auth)
			return res.redirect('/dash');
		else
			res.view();
	},
	login: function (req, res)
	{
		passport.authenticate('basic',
		{
			session: true
		}, function (err, user, info)
		{
			if ((err) || (!user))
			{
				return res.json(
				{
					message: "There is an error with authorisation."
				}, 401);
			}
			req.logIn(user, function (err)
			{
				if (err)
					return res.json(err);

				return res.json(
				{
					user: user,
					message: "Logged in."
				}, 200);
			});
		})(req, res);
	},
	logout: function (req, res)
	{
		req.logout();
		res.json(
		{
			message: "Logout successful."
		});
		return res.redirect("/");
	}
};