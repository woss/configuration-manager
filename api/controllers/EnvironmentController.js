/**
 * EnvironmentController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
	getEnvs: function (req, res)
	{
		Environment.find(
		{
			where:
			{
				appUUID: req.param('appUUID')
			}
		}).done(function (err, envs)
		{
			if (req.isJson || req.isAjax)
				res.json(envs);
			else
				res.view(
				{
					envs: envs
				})
		});
	},
	getEnv: function (req, res)
	{
		Environment.find(
		{
			where:
			{
				appUUID: req.param('appUUID')
			}
		}).done(function (err, envs)
		{
			res.json(envs);
		});
	}
};