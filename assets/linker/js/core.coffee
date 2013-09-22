ch =
  make_base_auth: (user, password) ->
    hash = undefined
    tok = undefined
    tok = user + ":" + password
    hash = btoa(tok)
    "Basic " + hash

  makePost: (data, location) ->
    $.ajax
      type: "POST"
      url: location
      async: true
      contentType: "application/json; charset=utf-8"
      data: data
      success: (xhr) ->
        xhr
      error: (xhr, type) ->
        xhr

  makePut: (data, location, _cb) ->
    $.ajax
      type: "PUT"
      url: location
      dataType: "json"
      async: false
      contentType: "application/json; charset=utf-8"
      data: JSON.stringify(data)
      success: (xhr) ->
        _cb({xhr:xhr,success:true})
      error: (xhr, type) ->
        _cb({xhr:xhr,success:false, error: type})
