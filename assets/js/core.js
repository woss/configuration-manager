var ch = {
	make_base_auth: function (user, password)
	{
		var tok = user + ':' + password;
		var hash = btoa(tok);
		return "Basic " + hash;
	}
}