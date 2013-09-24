/**
 * AuthController
 *
 */
var passport = require('passport');
module.exports = {

	index: function (req, res)
	{
		res.view();
	},
	login: function (req, res)
	{
		passport.authenticate('basic',
		{
			session: true
		}, function (err, user, info)
		{
			console.log(err);
			console.log(user);
			console.log(info);
			if ((err) || (!user))
			{

				return res.send(
				{
					message: "There is an error with authorisation."
				}, 401);
				// res.send(err);
			}
			req.logIn(user, function (err)
			{
				if (err)
					return res.send(err);

				return res.send(
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
		res.send(
		{
			message: "Logout successful."
		});
		return res.redirect("/");
	}
};

/**
 * Sails controllers expose some logic automatically via blueprints.
 *
 * Blueprints are enabled for all controllers by default, and they can be turned on or off
 * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
 * for AuthController.
 *
 * NOTE:
 * REST and CRUD shortcut blueprints are only enabled if a matching model file
 * (`models/Auth.js`) exists.
 *
 * NOTE:
 * You may also override the logic and leave the routes intact by creating your own
 * custom middleware for AuthController's `find`, `create`, `update`, and/or
 * `destroy` actions.
 */

module.exports.blueprints = {

	// Expose a route for every method,
	// e.g.
	// `/auth/foo` => `foo: function (req, res) {}`
	actions: true,

	// Expose a RESTful API, e.g.
	// `post /auth` => `create: function (req, res) {}`
	rest: true,

	// Expose simple CRUD shortcuts, e.g.
	// `/auth/create` => `create: function (req, res) {}`
	// (useful for prototyping)
	shortcuts: true

};