/**
 * api/models/User.js
 *
 * The user model contains the instance method for validating the password.
 */

var bcrypt = require('bcrypt');

function hashPassword(values, next)
{
	bcrypt.hash(values.password, 10, function (err, hash)
	{
		if (err)
		{
			return next(err);
		}
		values.password = hash;
		next();
	});
}
module.exports = {
	tableName: 'users',
	attributes:
	{
		username:
		{
			type: 'email',
			required: true,
			unique: true
		},
		password:
		{
			type: 'STRING',
			required: true,
			minLength: 6
		},
		// Override toJSON instance method to remove password value
		toJSON: function ()
		{
			var obj = this.toObject();
			delete obj.password;
			return obj;
		},
		validPassword: function (password, callback)
		{
			var obj = this.toObject();
			if (callback)
			{
				//callback (err, res)
				return bcrypt.compare(password, obj.password, callback);
			}
			return bcrypt.compareSync(password, obj.password);
		}
	},
	// Lifecycle Callbacks
	beforeCreate: function (values, next)
	{
		hashPassword(values, next);
	},
	beforeUpdate: function (values, next)
	{
		if (values.password)
		{
			hashPassword(values, next);
		}
		else
		{
			User.findOne(values.id).done(function (err, user)
			{
				if (err)
				{
					next(err);
				}
				else
				{
					values.password = user.password;
					next();
				}
			});
		}
	}
};