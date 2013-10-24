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
	get: function (req, res)
	{
		var redis = sails.config.session.store.client;
		var confId = req.param('id');
		redis.get(confId, function (err, conf)
		{
			if (err)
				res.json(err, 400)
			else
			{
				if (conf)
					res.json(JSON.parse(conf));
				else
					res.json(
					{
						error: true,
						message: "Configurationn not found in REDIS, If you didn't run PUBLISH you should do it now"
					}, 400)
			}
		});

	},
	publish: function (req, res)
	{
		var redis = sails.config.session.store.client;
		Conf.redis = redis;
		var id = req.param('id');
		Configuration.findOne(
		{
			id: id
		}).done(function (err, conf)
		{
			Application.findOne(
			{
				id: conf.appId,
			}).done(function (err, app)
			{
				var mergedConf = merge(app.baseConfig, conf.data);
				Conf.replacePaths(mergedConf, function (resp)
				{
					// console.log(resp);
					if (resp.success)
					{
						// add first user
						// client.sadd("confs", "confs:" + conf[0].uuid);
						var uuid = require('node-uuid');
						var hash = uuid.v4();

						// redis.hmset("confs:" + conf.id, "data", JSON.stringify(resp.data));
						// redis.hmset("published:" + hash, "data", JSON.stringify(resp.data));
						// client.hmset("confs:" + conf[0].uuid, "conf", JSON.stringify(currentConf));
						// console.log('Adding conf to redis');
						redis.set(conf.id, JSON.stringify(resp.data));
						Configuration.update(
						{
							id: conf.id
						},
						{
							active: true
						}).done(function (err, resp) {});
						return res.json(
						{
							result: resp.data
						});
					}
					else
						return res.json(500,
						{
							error: resp.error
						});
				});

			});
		});
	},
	preview: function (req, res)
	{
		var redis = sails.config.session.store.client;
		Conf.redis = redis;
		var id = req.param('id');
		Configuration.findOne(
		{
			id: id
		}).done(function (err, conf)
		{
			Application.findOne(
			{
				id: conf.appId,
			}).done(function (err, app)
			{
				var mergedConf = merge(app.baseConfig, conf.data);
				Conf.replacePaths(mergedConf, function (resp)
				{
					// console.log(resp);
					if (resp.success)
					{
						// add first user
						// client.sadd("confs", "confs:" + conf[0].uuid);
						var uuid = require('node-uuid');
						var hash = uuid.v4();

						// redis.hmset("confs:" + conf.id, "data", JSON.stringify(resp.data));
						// redis.hmset("published:" + hash, "data", JSON.stringify(resp.data));
						// client.hmset("confs:" + conf[0].uuid, "conf", JSON.stringify(currentConf));
						// console.log('Adding conf to redis');
						// redis.set(conf.id, JSON.stringify(resp.data));
						return res.json(
						{
							data: resp.data,
							accessId: hash
						});
					}
					else
						return res.json(500,
						{
							error: resp.error
						});
				});

			});
		});
	},
	/**
	 * Get configuration main method
	 * @param  {[type]} req
	 * @param  {[type]} res
	 * @return {[type]}
	 */
	createConf: function (req, res)
	{
		// Redis session client connection
		var redis = sails.config.session.store.client;
		Conf.redis = redis;
		var id = req.param('id');
		Conf.checkIsItCached(id, function (conf)
		{

			if (conf.success && _.isObject(conf))
			{
				console.log('Conf in redis');
				return res.json(conf.data)
			}
			else
			{
				Configuration.findOne(
				{
					uuid: id
				}).done(function (err, conf)
				{

					Configuration.findOne(
					{
						envUUID: conf.envUUID,
						baseConfig: true
					}).done(function (err, baseConf)
					{
						console.log(conf)
						console.log(baseConf)
						var mergedConf = merge(baseConf.data, conf.data);
						Conf.replacePaths(mergedConf, function (resp)
						{
							// console.log(resp);
							if (resp.success)
							{
								// add first user
								// client.sadd("confs", "confs:" + conf[0].uuid);
								// client.hmset("confs:" + conf[0].uuid, "conf", JSON.stringify(currentConf));
								console.log('Adding conf to redis');
								redis.set(conf[0].uuid, JSON.stringify(resp.data));
								return res.json(resp.data);
							}
							else
								return res.json(500,
								{
									error: resp.error
								});
						});

					});
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