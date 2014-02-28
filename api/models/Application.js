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
			type: "string"
		},
		active:
		{
			type: "boolean",
			defaultsTo: false
		},
		allowAccess:
		{
			type: 'json',
			defaultsTo:
			{
				fromIPs: ["127.0.0.1"],
				fromHosts: ["localhost"]
			}
		}
	}

};