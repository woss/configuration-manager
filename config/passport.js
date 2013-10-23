var passport = require('passport'),
	BasicStrategy = require('passport-http').BasicStrategy;

module.exports = {
	express:
	{
		customMiddleware: function (app)
		{
			console.log(passport);
			app.use(passport.initialize());
			app.use(passport.session());
		}
	}
};