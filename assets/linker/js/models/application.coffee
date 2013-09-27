class App
  constructor: (data) ->
    @name = ko.observable(data.name)
    @id = data.id
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
    data = {name: this.newAppName(), active: this.isActive()}
    console.log data
    self.apps.push( new App(data) )
    self.newAppName(this.newAppName())
  socket.get "/application", (apps) ->
    mappedApps = _.map apps, (app) ->
      new App(app)
    self.apps mappedApps
  socket.on "message", (data) ->
    if data.model is "application"
      self.apps.push(new App(data.data))
  _var = 'foo'
ko.applyBindings new AppListViewModel()