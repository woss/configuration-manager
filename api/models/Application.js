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
		name:
		{
			type: "string",
			required: true
		},
		userID:
		{
			type: "string",
			required: true
		},
		baseConfig:
		{
			type: "json",
			required: true
		},
		active:
		{
			type: "boolean",
			defaultsTo: false
		}
	}

};