class App
  constructor: (data) ->
    @name = ko.observable(data.name)
    @isActive = ko.observable(data.active)
  
AppListViewModel = ->
  self = this
  self.apps = ko.observableArray([])
  self.newAppName = ko.observable()
  self.isActive = ko.observable()
  self.disabledApps = ko.computed ->
    ko.utils.arrayFilter self.apps(), (app) ->
      not app.isActive()
  self.removeApp = (app) ->
    self.apps.remove app
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
    console.log messages data
ko.applyBindings new AppListViewModel()