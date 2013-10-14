/**
 * Environments
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
	tableName: 'environments',
	attributes:
	{
		id: "string",
		uuid:
		{
			type: "uuidv4"
		},
		appUUID:
		{
			type: "uuidv4",
			required: true
		},
		name:
		{
			type: "string",
			required: true
		},
		baseEnv:
		{
			type: "boolean",
			defaultsTo: false
		},
		active:
		{
			type: "boolean",
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