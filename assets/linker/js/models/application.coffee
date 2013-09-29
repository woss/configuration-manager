class App
  constructor: (data) ->
    @name = ko.observable(data.name)
    @id = data.id
    @uuid = data.uuid
    @isActive = ko.observable(data.active)
    @isNotActive = ko.observable(data.active)

AppListViewModel = ->
  self = this
  self.apps = ko.observableArray([])
  self.newAppName = ko.observable()
  self.isActive = ko.observable()
  self.isNotActive = ko.observable()
  self.disabledApps = ko.computed ->
    ko.utils.arrayFilter self.apps(), (app) ->
      not app.isActive()
  self.removeApp = (app) ->
    data = {id:app.id}
    socket.delete "/application",data, (res) ->
      self.apps.remove app  
      console.log res
  self.addApp = () ->
    data = {name: this.newAppName(), active: this.isActive(), userID: ch.user.id}
    socket.post "/application/create",data, (app) ->
      console.log data
      console.log app
      self.apps.push( new App(data) )
  # getting data
  socket.get "/application", (apps) ->
    mappedApps = _.map apps, (app) ->
      new App(app)
    self.apps mappedApps
  #listening socket for new apps
  socket.on "message", (data) ->
    if data.model is "application"
      self.apps.push(new App(data.data))
  self.openApp = (app) -> 
    console.log app
    data = {
      "where":{
        "appUUID":app.uuid
      }
    }
    socket.post "/environment/find", data, (envs) ->
      console.log envs
      # console.log new Env(envs[7])
      $(".jumbotron").addClass "sr-only"
  _var = 'foo'
ko.applyBindings new AppListViewModel(), $("#appList")[0]