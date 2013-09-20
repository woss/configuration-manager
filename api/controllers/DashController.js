/**
 * DashController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	index: function (req, res)
	{
		return res.view(
		{
			corndogs: [
			{
				name: 'Hank the Corndog'
			},
			{
				name: 'Lenny the Corndog'
			}]
		});
	}
};