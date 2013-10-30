/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, next)
{
	// User is allowed, proceed to controller
	if (req.isAuthenticated())
		return next();
	// User is not allowed
	else
	{
		if (req.isSocket || req.isAjax)
			return res.json(401);

		return res.redirect('/');
	}

};