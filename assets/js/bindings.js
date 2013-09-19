// $(document).on('ajaxBeforeSend', function (e, xhr, options)
// {
// 	// This gets fired for every Ajax request performed on the page.
// 	// The xhr  object and $.ajax() options are available for editing.
// 	// Return false to cancel this request.
// })
// Authorization: Basic "Base64(username:password)"
$('#login').on('click', function (e)
{
	var username = $("#username").val(),
		password = $("#password").val();

	var authHash = ch.make_base_auth(username, password);
	$.ajax(
	{
		type: "POST",
		url: "login",
		// dataType: 'json',
		async: false,
		data: '{}',
		beforeSend: function (xhr)
		{
			xhr.setRequestHeader('Authorization', authHash);
		},
		success: function ()
		{
			window.location.href = 'dash';
		},
		error: function (xhr, type)
		{
			console.log('error');
			alert(JSON.stringify(xhr));
		}
	});
});