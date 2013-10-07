/**
 * ConfigurationsController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */
var _ = require('underscore');
var jsonpath = require('JSONPath').eval;
var XRegExp = require('xregexp').XRegExp;
var util = require('util');
var merge = require('deepmerge');
var Hash = require("hashish");

replacePaths = function (data, cb)
{
	var regex = XRegExp("\\{\\+.*?\\+\\}/");
	var dataString = JSON.stringify(data);
	var match = XRegExp.replace(dataString, regex, function (_resp)
	{
		console.log(_resp[0]);
		return '';
	});
	// var match = XRegExp.exec(dataString, regex);
	// regexRes = dataString.match(regex);
	console.log(util.inspect(match, false, null))
	return cb(data);
}

module.exports = {

	verifyStructure: function ($) {},

	/**
	 * Get configuration main method
	 * @param  {[type]} req
	 * @param  {[type]} res
	 * @return {[type]}
	 */
	getConf: function (req, res)
	{
		var appUUID = req.param("appUUID");
		var envUUID = req.param("envUUID");

		// console.log(req.header('Host')); get host from request. it could be restricted with that aswell

		// TODO check is application active or not
		// if not then throw error
		// refactor the responses to serve websockets as well, just plain websocekts resp

		// let's find baseConf for this app
		Configuration.find(
		{
			appUUID: appUUID,
			baseConfig: true
		}).done(function (err, _bconf)
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
				}).done(function (err, conf)
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
						replacePaths(mergedConf, function (resp)
						{
							console.log(resp);
							res.json(resp);
						});

					}
				});
			}
		});
	},
	deleteAll: function (req, res)
	{
		// For example, to delete a user named Johnny,
		Configuration.destroy().done(function (err)
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