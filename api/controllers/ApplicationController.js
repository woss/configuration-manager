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
		Application.subscribe(req.socket, 'message');
		Application.create(
		{
			name: name,
			userID: req.user.id
		}).done(function (error, app)
		{
			console.log(app);
			Application.publishCreate(
			{
				data:
				{
					id: 3,
					name: 'Randy'
				},
				id: 3,
				model: 'user',
				verb: 'create'
			});
			if (error)
			{
				console.log(error);
				return res.json(500,
				{
					error: "DB Error app",
					message: error
				});
			}
			res.json(app);
			// // generating the baseConf and saving to App
			// BaseConfig.create(
			// {
			// 	appId: app.id,
			// 	currentRevision: 0,
			// 	publishedRevision: 0,
			// 	data:
			// 	{}
			// }).done(function (error, bConf)
			// {
			// 	if (error)
			// 	{
			// 		return res.json(500,
			// 		{
			// 			error: "DB Error bConf",
			// 			message: error
			// 		});
			// 	}
			// 	app.baseConfig = bConf.id
			// 	app.save();
			// });
			// var scaffoldEnvs = ['Dev', 'Prod', 'RC', 'CI'];
			// var createdIds = {};
			// for (var i = 0; i < scaffoldEnvs.length; i++)
			// {
			// 	var scaffoldEnv = scaffoldEnvs[i];
			// 	Environment.create(
			// 	{
			// 		name: scaffoldEnv,
			// 		appId: app.id,
			// 		active: true,
			// 	})
			// 		.done(function (error, env)
			// 		{
			// 			if (error)
			// 			{
			// 				return res.json(500,
			// 				{
			// 					error: "DB Error env",
			// 					message: error
			// 				});
			// 			}
			// 			var envId = env.id;
			// 			createdIds[envId] = {
			// 				conf: []
			// 			};
			// 			Configuration.create(
			// 			{
			// 				appId: app.id,
			// 				envId: envId,
			// 				data:
			// 				{}
			// 			})
			// 				.done(function (error, conf)
			// 				{
			// 					if (error)
			// 					{
			// 						return res.json(500,
			// 						{
			// 							error: "DB Error conf",
			// 							message: error
			// 						});
			// 					}
			// 					console.log('im fired async')
			// 					createdIds[envId].conf.push(conf.id);

			// 					// Application.update(
			// 					// {
			// 					// 	id: app.id
			// 					// },
			// 					// {
			// 					// 	envs: createdIds
			// 					// }, function (err, _app)
			// 					// {
			// 					// 	if (err)
			// 					// 	{
			// 					// 		console.log(err);
			// 					// 		return res.json(
			// 					// 		{
			// 					// 			error: "DB Error _app",
			// 					// 			message: err
			// 					// 		}, 500);
			// 					// 	}
			// 					// 	console.log('im fired async when conf is done')
			// 					// });
			// 				});
			// 		});
			// }

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