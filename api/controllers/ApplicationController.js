/**
 * ApplicationController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

function createScaffoldEnvs(appId, callback)
{

	callback && callback(createdIds);
};

module.exports = {
	get: function (req, res)
	{
		Application.findOne(
		{
			id: req.param('id')
		}).done(function (err, app)
		{
			console.log(_.size(app.envs))
			console.log(app)
			res.view('application/get',
			{
				layout: null,
				app: app,
				envs: _.size(app.envs)
			});
		});

	},
	create: function (req, res)
	{
		if (_.isUndefined(req.param("name")))
		{
			return res.json(
			{
				success: false,
				message: "Name must be provided"

			});
		}
		var name = req.param('name');

		Application.create(
		{
			name: name,
			userID: req.user.id,
			baseConfig:
			{}
		})
			.done(function (error, app)
			{
				if (error)
				{
					return res.json(500,
					{
						error: "DB Error",
						message: error
					});
				}
				var scaffoldEnvs = ['Dev', 'Prod', 'RC', 'CI'];
				var createdIds = {};
				for (var i = 0; i < scaffoldEnvs.length; i++)
				{
					var scaffoldEnv = scaffoldEnvs[i];
					Environment.create(
					{
						name: scaffoldEnv,
						appId: app.id,
						active: true,
					})
						.done(function (error, env)
						{
							var envId = env.id;
							createdIds[envId] = {
								conf: []
							};
							Configuration.create(
							{
								appId: app.id,
								envId: envId,
								data:
								{}
							})
								.done(function (error, conf)
								{
									console.log('im fired async')
									createdIds[envId].conf.push(conf.id);
									Application.update(
									{
										id: app.id
									},
									{
										envs: createdIds
									}, function (err, _app)
									{
										console.log('im fired async when app is done')
									});
								});

						});
				}
				res.json(app);
			});

	},

	deleteAll: function (req, res)
	{
		resJson = {
			success: true
		};
		Application.destroy()
			.done(function (err)
			{
				if (err)
					resJson = {
						success: false,
						error: err
					};
				else
					resJson = {
						success: true,
						message: "Applications deleted"
					};
			});
		Environment.destroy()
			.done(function (err)
			{
				if (err)
					resJson = {
						success: false,
						error: err
					};
				else
					resJson = {
						success: true,
						message: "Environments deleted"
					};
			});
		Configuration.destroy()
			.done(function (err)
			{
				if (err)
					resJson = {
						success: false,
						error: err
					};
				else
					resJson = {
						success: true,
						message: "Configuration deleted"
					};
			});

		return res.json(resJson);
	}
}