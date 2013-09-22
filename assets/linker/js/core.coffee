ch = make_base_auth: (user, password) ->
  tok = user + ":" + password
  hash = btoa(tok)
  "Basic " + hash
user = 
  username: ''
  id: ''
  authHash: ''
