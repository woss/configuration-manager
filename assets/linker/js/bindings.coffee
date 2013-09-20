$("#loginButton").on "click", (e) ->
  username = $("#username").val()
  password = $("#password").val()
  authHash = ch.make_base_auth(username, password)
  $.ajax
    type: "POST"
    url: "login"
    async: true
    data: "{}"
    beforeSend: (xhr) ->
      xhr.setRequestHeader "Authorization", authHash
    success: ->
      window.location.href = "dash"
    error: (xhr, type) ->
      console.log "error"
$("#signUpButton").on "click", (e) ->
  username = $("#usernameSP").val()
  password = $("#passwordSP").val()
  passwordAgain = $("#passwordAgainSP").val()
  if password is passwordAgain
    authHash = ch.make_base_auth(username, password)
    $.ajax
      type: "POST"
      url: "user"
      async: true
      dataType: 'json'
      data: {"username":username,"password":password}
      success: ->
        ch.authHash = authHash
        alert "U have succesfully sign up. plesase login"
        $("#username").val(username)
        $("#password").val(password)
        $( "#loginButton" ).trigger( "click" )
      error: (xhr, type) ->
        console.log xhr
        errorMsg = JSON.parse(xhr.responseText)
        console.log errorMsg
        alert errorMsg.errors[0].message
  else
    alert "Passwords not the same"