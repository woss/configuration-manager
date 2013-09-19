// $(document).on('ajaxBeforeSend', function (e, xhr, options)
// {
//  // This gets fired for every Ajax request performed on the page.
//  // The xhr object and $.ajax() options are available for editing.
//  // Return false to cancel this request.
// })
// Authorization: Basic "Base64(username:password)"
$('#login').on('click', function (e)
{
	// $.ajax(
	// {
	//  type: 'POST',
	//  url: '/login',
	//  // data to be added to query string:
	//  data:
	//  {
	//    name: 'Zepto.js'
	//  },
	//  // type of data we are expecting in return:
	//  dataType: 'json',
	//  timeout: 300,
	//  context: $('body'),
	//  success: function (data)
	//  {
	//    // Supposing this JSON payload was received:
	//    //   {"project": {"id": 42, "html": "<div>..." }}
	//    // append the HTML to context object.
	//    this.append(data.project.html)
	//  },
	//  error: function (xhr, type)
	//  {
	//    alert('Ajax error!')
	//  }
	// })

	// post a JSON payload:
	$.ajax(
	{
		type: 'POST',
		url: '/login',
		// post payload:
		data: JSON.stringify(
		{
			username: $("#username").val()
		}),
		contentType: 'application/json'
	})

});