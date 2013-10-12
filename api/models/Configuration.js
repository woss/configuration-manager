/**
 * Configurations
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
	tableName: "configurations",
	attributes:
	{
		id: "string",
		uuid:
		{
			type: "uuidv4",
			index: true
		},
		appUUID:
		{
			type: "uuidv4",
			required: true
		},
		data:
		{
			type: "json",
			required: true
		},
		envUUID:
		{
			type: "uuidv4",
			required: true
		},
		baseConfigUUID: "uuidv4",
		baseConfig:
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
	// beforeCreate: function(values, cb) {
	//   var self = this;

	//   // an example encrypt function defined somewhere
	//   encrypt(this.password, function(err, password) {
	//     if(err) return cb(err);

	//     self.password = password;
	//     cb();
	//   });
	// },

};