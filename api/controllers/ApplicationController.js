/**
 * ApplicationController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
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
		Application.create(
		{
			name: req.param('name'),
			userID: req.user.id,
			active: req.param('active')
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
				else
				{
					Environment.create(
					{
						name: 'BASE',
						appUUID: app.uuid,
						baseEnv: true,
						active: true,
					})
						.done(function (error, env)
						{
							Configuration.create(
							{
								appUUID: app.uuid,
								envUUID: env.uuid,
								baseConfig: true,
								active: true,
								data:
								{}
							})
								.done(function ()
								{
									return res.json(
									{
										success: true,
										id: app.id,
										uuid: app.uuid,
										name: app.name,
										active: app.active
									});
								});
						});

				}
			})
	},

	deleteAll: function (req, res)
	{
		resJson = {
			success: true
		};
		// For example, to delete a user named Johnny,
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
		// For example, to delete a user named Johnny,
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
		// For example, to delete a user named Johnny,
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