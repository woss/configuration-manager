/**
 * ApplicationController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
	// create: function (req, res)
	// {
	// 	return res.json(
	// 	{
	// 		"uri": "/chat/create",
	// 		"data":
	// 		{
	// 			"id": 283,
	// 			"message": "who is going out tonight?",
	// 			"user":
	// 			{
	// 				"id": 3,
	// 				"username": "Roscoe"
	// 			}
	// 		}
	// 	});
	// 	if (_.isUndefined(req.param("name")))
	// 	{
	// 		return res.send(
	// 		{
	// 			success: false,
	// 			message: "Name must be provided"
	// 		});
	// 	}
	// 	Application.create(
	// 	{
	// 		name: req.param('name'),
	// 		userID: req.user.id,
	// 		active: req.param('active')
	// 	}).done(function (error, app)
	// 	{
	// 		if (error)
	// 		{
	// 			return res.send(500,
	// 			{
	// 				error: "DB Error",
	// 				message: error
	// 			});
	// 		}
	// 		else
	// 		{
	// 			res.send(
	// 			{
	// 				success: true,
	// 				id: app.id,
	// 				uuid: app.uuid,
	// 				name: app.name,
	// 				message: 'here'
	// 			});
	// 		}
	// 	})
	// },
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