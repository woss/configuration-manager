/**
 * ConfigurationsController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

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
		}).done(function (err, _bconf)
		{
			if (err)
			{
				res.send(500,
				{
					error: "Ooops ERROR " + JSON.stringify(err)
				});
			}
			else if (_bconf.length == 0)
			{
				res.send(500,
				{
					error: "There is no BaseConfig settings!!!! Create BaseConfig first then the rest"
				});
			}
			else
			{
				var baseConf = _bconf[0].data;

				// res.send(baseConf);

				Configuration.find(
				{
					envUUID: envUUID,
					appUUID: appUUID
				}).done(function (err, conf)
				{
					if (err)
					{
						res.send(500,
						{
							error: "Ooops ERROR " + JSON.stringify(err)
						});
					}
					else if (_bconf.length == 0)
					{
						res.send(500,
						{
							error: "There is no config settings!!!! Create it!!!!"
						});
					}
					else
					{
						var _ = require('underscore'),
							currentConf = conf[0].data;

						var mergedConf = _.extend(baseConf, currentConf);
						res.send(mergedConf);
					}
				});
			}
		});
	}
};
module.exports.blueprints = {

	// Expose a route for every method,
	// e.g.
	// `/auth/foo` => `foo: function (req, res) {}`
	actions: true,

	// Expose a RESTful API, e.g.
	// `post /auth` => `create: function (req, res) {}`
	rest: true,

	// Expose simple CRUD shortcuts, e.g.
	// `/auth/create` => `create: function (req, res) {}`
	// (useful for prototyping)
	shortcuts: true

};