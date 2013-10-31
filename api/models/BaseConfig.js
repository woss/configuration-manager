/**
 * BaseConfig
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

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
		appId:
		{
			type: "string",
			required: true
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