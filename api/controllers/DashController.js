/**
 * DashController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	index: function (req, res)
	{
		var user = req.user;
		var response = [];
		// console.log(req.user);
		Application.find(
		{
			userID: user.id
		}).sort('active DESC').done(function (err, _apps)
		{
			return res.view(
			{
				apps: _apps
			});
		});
	}
};