passport = require("passport")
module.exports =
  index: (req, res) ->
    is_auth = undefined
    is_auth = req.isAuthenticated()
    if is_auth
      res.redirect "/dash"
    else
      res.view()

  login: (req, res) ->
    passport.authenticate("basic",
      session: true,
    	(err, user, info) ->
      console.log err
      console.log user
      console.log info
      if err or (not user)
        return res.send(
          message: "There is an error with authorisation."
        , 401)
      req.logIn user, (err) ->
        return res.send(err)  if err
        res.send
          user: user
          message: "Logged in."
        , 200

    ) req, res

  logout: (req, res) ->
    req.logout()
    res.send message: "Logout successful."
    res.redirect "/"