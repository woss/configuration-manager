/**
 * ConfigurationsController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */
var _ = require('underscore');
var jsonPath = require('JSONPath').eval;
var XRegExp = require('xregexp').XRegExp;
var util = require('util');
var merge = require('deepmerge');
var Hash = require("hashish");
var Conf = {
	_json:
	{},
	json: '',
	redis:
	{},
	/**
	 * Replacing placeholders in given configuration object
	 * @param  {[object]}			_json Configuration from DB
	 * @param  {Function} cb 	Regular callback
	 * @return {[object]}     Return object
	 */
	replacePaths: function (_json, cb)
	{
		if (_.isObject(_json))
			var json = JSON.stringify(_json)

		Conf._json = _json;
		Conf.json = json;

		var matches = XRegExp.matchRecursive(json, "\\{\\+\/", "\\+\\}", 'g',
		{
			valueNames: [null, null, 'match', null]
		});
		matches.forEach(function (item)
		{
			replacePattern = item.name
			Conf.recursiveFunction(replacePattern)
		});

		return cb(
		{
			success: true,
			data: JSON.parse(Conf.json)
		});
	},

	/**
	 * Recursive function that parses the placeholders and nodes
	 * @param  {[string]} item  		Matched placeholder
	 * @param  {[string]} searchPath  INitially empty, if dependency is found then we pass this
	 * @return {[function]}            [description]
	 */
	recursiveFunction: function (item, searchPath)
	{
		searchPath = searchPath || "";
		replacePattern = item

		var regex = XRegExp("\\{\\+\\/.*?\\+\\}");

		searchPath = "$.." + replacePattern.replace(/\//g, '.');

		valuePath = jsonPath(Conf._json, searchPath)[0];

		if (!_.isEmpty(searchPath) && searchPath != replacePattern)
		{
			// console.log('replacePattern ' + replacePattern)
			// console.log('master node for replacement is ' + searchPath);
			searchPath = "$.." + searchPath.replace(/\//g, '.');
			Conf.replaceJson(replacePattern, valuePath);
		}

		var matchDependancy = XRegExp.matchRecursive(valuePath, "\\{\\+\/", "\\+\\}", 'g')[0]

		if (!_.isEmpty(matchDependancy))
		{
			// console.log('-----------------')
			// console.log('In search path ' + searchPath)
			// console.log('Value is ' + valuePath);
			// console.log('Discovered dependency is ' + matchDependancy + ' must resolve this first')
			// console.log('-----------------')
			Conf.recursiveFunction(matchDependancy, replacePattern)
		}
		// here is replacement
		Conf.replaceJson(replacePattern, valuePath);
	},
	/**
	 * Small generic piece of code for replacement patternt
	 * @param  {[string]} placeHolder
	 * @param  {[string]} value
	 * @return {[null]}             [description]
	 */
	replaceJson: function (placeHolder, value)
	{
		// console.log('Replacing ' + placeHolder + " with value " + value)
		var replacePlacehodler = '{+/' + placeHolder + '+}';
		Conf.json = Conf.json.replace(replacePlacehodler, value);
		// console.log('+++++++++++++++')
	},
	checkIsItCached: function (confId, cb)
	{
		confId = confId.split('|')[2];
		console.log(confId);
		var hash = Conf.redis.get(confId, function (err, conf)
		{
			if (err)
			{
				cb(
				{
					success: false,
					data: err
				});
			}
			else
			{
				if (_.isEmpty(conf))
				{
					cb(
					{
						success: false,
						msg: 'No configs in redis'
					});
				}
				else
				{
					cb(
					{
						success: true,
						data: JSON.parse(conf)
					});
				}
			}
		});
	}
};

module.exports = {
	/**
	 * Get configuration main method
	 * @param  {[type]} req
	 * @param  {[type]} res
	 * @return {[type]}
	 */
	createConf: function (req, res)
	{
		// Redis session client connection
		var client = sails.config.session.store.client;
		Conf.redis = client;
		var id = req.param('id');
		Conf.checkIsItCached(id, function (conf)
		{
			console.log('Conf in redis');
			if (conf.success && _.isObject(conf))
				res.json(conf.data)
			else
			{
				Configuration.find(
				{
					uuid: id
				}).done(function (err, conf) {

				});
			}
		});
	},
	/**
	 * [deleteAll description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	deleteAll: function (req, res)
	{
		// For example, to delete a user named Johnny,
		Configuration.destroy()
			.done(function (err)
			{
				if (err)
					return res.json(
					{
						success: false,
						error: err
					});
				else
					res.json(
					{
						success: true,
						message: "Configurations deleted"
					});
			});
	}
};