/**
 * BaseConfigController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var identity = 'baseConfig';
module.exports = {
	update: function (req, res, next)
	{
		var reqData = req.param('data'),
			reqId = req.param('id');

		BaseConfig.findOne(
		{
			id: reqId
		}).done(function (err, conf)
		{
			var currentRevision = conf.currentRevision + 1;
			History.create(
			{
				of: identity,
				confId: reqId,
				data: reqData,
				revision: currentRevision
			}).done(function (err, history)
			{
				conf.data = reqData;
				conf.history[currentRevision] = history.id;
				conf.currentRevision = currentRevision;
				conf.save(function (err, save)
				{
					if (err)
						res.json(err, 400);
					else
						res.json(save);
				});
			});
		});
		res.json(
		{
			success: true
		})
	},

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to BaseConfigController)
	 */
	_config:
	{}

};