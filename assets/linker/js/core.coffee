ch = make_base_auth: (user, password) ->
  tok = user + ":" + password
  hash = btoa(tok)
  "Basic " + hash
ch = makePost: (data, location) ->
  $.ajax
    type: "POST"
    url: location
    async: true
    data: data
    success: (xhr)->
      return xhr
    error: (xhr, type) ->
      return xhr
ch = makePut: (data, location) ->
  console.log(data)
  $.ajax
    type: "PUT"
    url: location
    dataType: 'json'
    async: true
    data: data
    success: (xhr)->
      return xhr
    error: (xhr, type) ->
      return xhr