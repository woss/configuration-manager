class ch
  user : {}
  make_base_auth: (user, password) ->
    hash = undefined
    tok = undefined
    tok = user + ":" + password
    hash = btoa(tok)
    "Basic " + hash

  makePost: (data, location, _cb) ->
    $.ajax
      type: "POST"
      url: location
      dataType: "json"
      async: true
      contentType: "application/json; charset=utf-8"
      data: JSON.stringify(data)
      success: (xhr) ->
        _cb({xhr:xhr,success:true})
      error: (xhr, type) ->
        _cb({xhr:xhr,success:false, error: type})

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

  findRequest: (data, location, _cb) ->
    $.ajax
      type: "POST"
      url: location
      dataType: "json"
      async: false
      contentType: "application/json; charset=utf-8"
      data: JSON.stringify(data)
      success: (xhr) ->
        _cb({xhr:xhr,success:true})
      error: (xhr, type) ->
        _cb({xhr:xhr,success:false, error: type})

  showFlashMsg: (type, message, _cb) ->
    typeList = {
      "w": "alert-warning",
      "d": "alert-danger",
      "s": "alert-success",
      "l": "alert-link",
      "i": "alert-info"
    }
    $("#flash p").html(message)
    $("#flash").addClass(typeList[type]).show()

ch = new ch();

