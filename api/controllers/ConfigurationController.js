/**
 * ConfigurationsController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */
var _ = require('underscore');
var jp = require('JSONPath')
	.eval;
var XRegExp = require('xregexp')
	.XRegExp;
var util = require('util');
var merge = require('deepmerge');
var Hash = require("hashish");

replacePaths = function (data, cb)
{
	if (!_.isString(data))
		var dataString = JSON.stringify(data);
	else
		var dataString = data;

	// console.log(typeof data);
	// console.log(typeof dataString);
	// 
	var matches = XRegExp.matchRecursive(dataString, "\\{\\+\/", "\\+\\}", 'g',
	{
		valueNames: [null, null, 'value', null],
	});

	// Let's loop through matches 
	for (var i = matches.length - 1; i >= 0; i--)
	{
		// console.log(matches[i]);
		// console.log(typeof matches[i]);

		var placeHolder = matches[i].name;

		// JSONpath  parsing
		var searchPath = "$.." + placeHolder.replace(/\//g, '.');
		var valuePath = jp(data, searchPath)[0];
		// console.log(placeHolder);
		// console.log(valuePath);
		if (!_.isString(valuePath))
			return cb(
			{
				success: false,
				error: "Error in assiging dependent variable of {" + placeHolder + "}"
			});

		// We should check dependancies of placeholders
		// start
		var regex = XRegExp("\\{\\+\\/.*?\\+\\}");
		var matchDependancy = XRegExp.exec(valuePath, regex);
		console.log(typeof matchDependancy);
		console.log(matchDependancy);
		return cb(
		{
			success: true,
			data: matchDependancy[0]
		});
		// end

		var replacePlacehodler = '{+/' + placeHolder + '+}';

		// console.log(searchPath);
		// console.log(valuePath);
		// console.log(replacePlacehodler);
		var dataString = dataString.replace(replacePlacehodler, valuePath);
	};
	// return cb(
	// {
	//  success: true,
	//  data: JSON.parse(dataString)
	// });
},
verifyStructure = function ($) {},

module.exports = {

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
								replacePaths(mergedConf, function (resp)
								{
									// console.log(resp);
									if (resp.success)
										res.json(resp.data);
									// res.json(mergedConf);
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