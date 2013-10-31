/**
 * History
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes:
	{
		id: "string",
		confId:
		{
			type: "string",
			required: true
		},
		data:
		{
			type: "json",
			required: true,
			defaultsTo:
			{}
		},
		of:
		{
			type: "string"
		},
		revision:
		{
			type: "integer"
		}
	}
};