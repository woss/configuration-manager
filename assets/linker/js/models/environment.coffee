class Env 
  constructor: (data) ->
    @name = data.name

EnvListViewModel = ->
  self = this
  self.envs = ko.observableArray([])
  self.newAppName = ko.observable()
  self.isActive = ko.observable()
  self.isNotActive = ko.observable()
  self.disabledenvs = ko.computed ->
    ko.utils.arrayFilter self.envs(), (app) ->
      not app.isActive()
  self.removeApp = (app) ->
    data = {id:app.id}
    socket.delete "/application",data, (res) ->
      self.envs.remove app  
      console.log res
  self.addApp = () ->
    data = {name: this.newAppName(), active: this.isActive(), userID: ch.user.id}
    socket.post "/application",data, (app) ->
      console.log data
      console.log app
      self.envs.push( new App(data) )
  # getting data
  socket.get "/application", (envs) ->
    mappedenvs = _.map envs, (app) ->
      new App(app)
    self.envs mappedenvs
  #listening socket for new envs
  socket.on "message", (data) ->
    if data.model is "application"
      self.envs.push(new App(data.data))
  self.openApp = (app) -> 
    socket.get "/environment", (envs) ->
      console.log envs
      console.log new Env(envs[7])
    _v = 'f'
    console.log app
  _var = 'foo'
ko.applyBindings new EnvListViewModel(), $("#envList")[0]