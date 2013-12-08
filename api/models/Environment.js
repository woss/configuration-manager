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
		appId:
		{
			type: "string",
			required: true
		},
		name:
		{
			type: "string",
			required: true
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