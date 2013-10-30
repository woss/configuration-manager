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
		appId:
		{
			type: "string",
			required: true
		},
		data:
		{
			type: "json",
			required: true
		},
		envId:
		{
			type: "string",
			required: true
		},
		active:
		{
			type: "boolean",
			defaultsTo: false
		},
		history:
		{
			type: 'json',
			defaultsTo:
			{}
		},
		currentRevision:
		{
			type: "integer"
		},
		publishedRevision:
		{
			type: "integer"
		}

	}
};