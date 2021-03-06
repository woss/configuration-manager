var passport = require('passport'),
	BasicStrategy = require('passport-http').BasicStrategy,
	bcrypt = require('bcrypt');

passport.serializeUser(function (user, done)
{
	done(null, user.id);
});

passport.deserializeUser(function (id, done)
{
	User.findOne(
	{
		id: id
	}).done(function (err, user)
	{
		done(err, user)
	});
});

function findById(id, fn)
{
	User.findOne(id).done(function (err, user)
	{
		if (err)
		{
			return fn(null, null);
		}
		else
		{
			return fn(null, user);
		}
	});
}

function findByUsername(u, fn)
{
	User.findOne(
	{
		username: u
	}).done(function (err, user)
	{
		// Error handling
		if (err)
		{
			return fn(null, null);
			// The User was found successfully!
		}
		else
		{
			return fn(null, user);
		}
	});
}
module.exports = {
	express:
	{
		customMiddleware: function (app)
		{
			passport.use(new BasicStrategy(
				function (username, password, done)
				{
					// asynchronous verification, for effect...
					process.nextTick(function ()
					{
						// Find the user by username. If there is no user with the given
						// username, or the password is not correct, set the user to `false` to
						// indicate failure and set a flash message. Otherwise, return the
						// authenticated `user`.
						findByUsername(username, function (err, user)
						{
							if (err)
								return done(null, err);
							if (!user)
							{
								return done(null, false,
								{
									message: 'Unknown user ' + username
								});
							}
							bcrypt.compare(password, user.password, function (err, res)
							{
								if (!res)
									return done(null, false,
									{
										message: 'Invalid Password'
									});
								var returnUser = {
									username: user.username,
									id: user.id
								};
								return done(null, returnUser);
							});
						})
					});
				}
			));
			app.use(passport.initialize());
			app.use(passport.session());
		}
	}
};