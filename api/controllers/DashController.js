/**
 * DashController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

    index: function(req, res) {
        var user = req.user;
        var response = [];
        // console.log(req.user);
        Application.find({
            userID: user.id
        }).sort('active DESC').done(function(err, _apps) {
            console.log(_apps);
            return res.view({
                apps: _apps,
                user: user
            });
            // _.each(_apps, function (_app)
            // {
            // 	var tmpApp = {};
            // 	tmpApp['app'] = _app;
            // 	Environment.find(
            // 	{
            // 		where:
            // 		{
            // 			appUUID: _app.uuid
            // 		}
            // 	}).done(function (err, _envs)
            // 	{
            // 		_.each(_envs, function (_env)
            // 		{
            // 			tmpApp['envs'] = [];
            // 			tmpApp['envs'].push(_env);

            // 			Configuration.find(
            // 			{
            // 				where:
            // 				{
            // 					appUUID: _app.uuid,
            // 					envUUID: _env.uuid
            // 				}
            // 			}).done(function (err, _confs)
            // 			{
            // 				tmpApp['confs'] = _confs;
            // 				console.log(tmpApp);
            // 				// return res.view(
            // 				// {
            // 				// 	apps: _apps,
            // 				// 	envs: _envs,
            // 				// 	confs: _confs,
            // 				// 	user: user
            // 				// });
            // 			});
            // 		})
            // 	});
            // 	response.push(tmpApp);
            // });
        });
    }
};
