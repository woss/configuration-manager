/**
 * ApplicationController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
	create: function (req, res)
	{
		// console.log(req.socket);
		// return res.json(
		// {
		// 	"uri": "/chat/create",
		// 	"data":
		// 	{
		// 		"id": 283,
		// 		"message": "who is going out tonight?",
		// 		"user":
		// 		{
		// 			"id": 3,
		// 			"username": "Roscoe"
		// 		}
		// 	}
		// });

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
						name: 'General',
						appUUID: app.uuid,
						baseEnv: true
					})
						.done(function (error, env)
						{
							Configuration.create(
							{
								appUUID: app.uuid,
								envUUID: env.uuid,
								baseConf: true,
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
		// For example, to delete a user named Johnny,
		Application.destroy().done(function (err)
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
					message: "Applications deleted"
				});
		});
	}
}