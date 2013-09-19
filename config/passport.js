var passport = require('passport'),
	BasicStrategy = require('passport-http').BasicStrategy;

module.exports = {
	express:
	{
		customMiddleware: function (app)
		{
			console.log('Express midleware for passport');
			app.use(passport.initialize());
			// app.use(passport.session());
		}
	}
};