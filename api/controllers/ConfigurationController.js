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
	getConf: function (req, res)
	{

		// console.log(sails.config);
		// console.log(sails.config.session.store.client);
		var client = sails.config.session.store.client;
		Conf.redis = client;
		Conf.checkIsItCached(req.param('id'), function (conf)
		{
			console.log('Conf in redis');
			if (conf.success && _.isObject(conf))
				res.json(conf.data)
			else
			{
				var appUUID = req.param("id").split('|')[0];
				var envUUID = req.param("id").split('|')[1];
				// console.log(req.header('Host')); get host from request. it could be restricted with that aswell
				console.log('ConfNot in redis');
				// TODO check is application active or not
				// if not then throw error
				// refactor the responses to serve websockets as well, just plain websocekts resp

				// let's find baseConf for this app
				Configuration.find(
				{
					appUUID: appUUID,
					baseConfig: true
				})
					.done(function (err, _bconf)
					{
						if (err)
						{
							res.json(500,
							{
								error: "Ooops ERROR " + JSON.stringify(err)
							});
						}
						else if (_bconf.length == 0)
						{
							res.json(500,
							{
								error: "There is no BaseConfig settings!!!! Create BaseConfig first then the rest"
							});
						}
						else
						{
							var baseConf = _bconf[0].data;
							var cloneBaseConf = Hash.clone(baseConf);

							Configuration.find(
							{
								envUUID: envUUID,
								appUUID: appUUID
							})
								.done(function (err, conf)
								{
									if (err)
									{
										res.json(500,
										{
											error: "Ooops ERROR " + JSON.stringify(err)
										});
									}
									else if (_bconf.length == 0)
									{
										res.json(500,
										{
											error: "There is no config settings!!!! Create it!!!!"
										});
									}
									else
									{
										var currentConf = conf[0].data;

										var mergedConf = merge(cloneBaseConf, currentConf);
										Conf.replacePaths(mergedConf, function (resp)
										{
											// console.log(resp);
											if (resp.success)
											{
												// add first user
												// client.sadd("confs", "confs:" + conf[0].uuid);
												// client.hmset("confs:" + conf[0].uuid, "conf", JSON.stringify(currentConf));
												console.log('Adding conf to redis');
												client.set(conf[0].uuid, JSON.stringify(resp.data));
												res.json(resp.data);
											}
											else
												res.json(500,
												{
													error: resp.error
												});
										});
									}
								});
						}
					});
			}
		});
	},
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