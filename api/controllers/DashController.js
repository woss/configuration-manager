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
		// console.log(req.user);
		Application.find(
		{
			userID: user.id
		}).done(function (err, _apps)
		{
			return res.view(
			{
				apps: _apps,
				user: user
			});
		});

	}
};