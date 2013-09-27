/**
 * ApplicationController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
	create: function (req, res)
	{
		if (req.param("name") == '')
		{
			res.json(
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
		}).done(function (error, app)
		{
			if (error)
			{
				res.send(500,
				{
					error: "DB Error"
				});
			}
			else
			{
				res.send(
				{
					success: true,
					id: app.id,
					uuid: app.uuid,
					name: app.name
				});
			}
		})
	},
	list: function (req, res)
	{
		var user = req.user;
		var response = [];
		// console.log(req.user);
		Application.find(
		{
			userID: user.id
		}).sort('active DESC').done(function (err, _apps)
		{
			// res.view('application/partials/list',
			// {
			// 	message: 'Login failed!',
			// 	layout: null,
			// 	apps: _apps,
			// 	success: true
			// });
			if (req.isJson || req.isSocket)
			{
				res.json(
				{
					apps: _apps,
					success: true
				});
			}
			else
			{
				res.view('application/list',
				{
					layout: null,
					apps: _apps,
					success: true
				});
			}
		});
	}
}