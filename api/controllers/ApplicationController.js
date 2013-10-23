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
		var name = req.param('name');

		Application.create(
		{
			name: name,
			userID: req.user.id
		})
			.done(function (error, app)
			{
				console.log(error);
				if (error)
				{
					return res.json(500,
					{
						error: "DB Error",
						message: error
					});
				}
				return res.json(app);
			});

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