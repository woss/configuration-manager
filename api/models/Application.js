/**
 * Applications
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
	tableName: 'applications',
	attributes:
	{
		id: "string",
		uuid:
		{
			type: "uuidv4"
		},
		name: "string",
		userID: "string",
		active:
		{
			type: "bollean",
			defaultsTo: false
		}
	},
	// Lifecycle Callbacks
	beforeCreate: function (values, next)
	{
		var uuid = require('node-uuid');
		var hash = uuid.v4();
		values.uuid = hash;
		next();
	}

};