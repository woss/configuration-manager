###
  You can either put the script block at the 
  bottom of your HTML document, 
  or you can put it at the top and wrap 
  the contents in a DOM-ready handler such as jQuery’s $ function.
###
$ ->
  class App
    constructor: (data) ->
      @name = ko.observable(data.name)
      @id = data.id
      @uuid = data.uuid
      @isActive = ko.observable(data.active)
      @isNotActive = ko.observable(data.active)

  class Env 
    constructor: (data) ->
      @name = ko.observable(data.name)
      @appUUID = data.appUUID
      @id = data.id
      @uuid = data.uuid
      @isActive = ko.observable(data.active)
      @isNotActive = ko.observable(data.active)
      @confs = ko.observableArray([])

  class Conf
    constructor: (data) ->
      @id = data.id
      @uuid = data.uuid
      @baseConfig = data.baseConfig
      @data = data.data
      @envUUID = data.envUUID


  ViewModel = ->
    self = this
    self.apps = ko.observableArray([])
    self.envs = ko.observableArray([])
    self.confs = ko.observableArray([])
    self.appInfo = ko.observable(false)
    self.newAppName = ko.observable()
    self.appName = ko.observable()
    self.isActive = ko.observable()
    self.isNotActive = ko.observable()
    self.disabledApps = ko.computed ->
      ko.utils.arrayFilter self.apps(), (app) ->
        not app.isActive()
    self.removeApp = (app) ->
      data = {id:app.id}
      socket.delete "/application",data, (res) ->
        self.apps.remove app  
    self.addApp = () ->
      data = {name: this.newAppName(), active: this.isActive(), userID: ch.user.id}
      socket.post "/application/create",data, (app) ->
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
      if data.model is "configuration"
        #rewrite this
        return
    self.openApp = (app) -> 
      self.appInfo = true
      self.appName(app.name)
      data = {
        "where":{
          "appUUID":app.uuid
        }
      }
      socket.post "/environment/find", data, (envs) ->
        mappedEnvs = _.map envs, (env) ->
          new Env(env)
        self.envs mappedEnvs
        self.getConfs(mappedEnvs)

    self.getConfs = (envs) ->
      _.map envs, (env) ->
        data = {
        "where":{
          "appUUID":env.appUUID,
          "envUUID":env.uuid
          }
        }
        socket.post "/configuration/find", data, (confs) ->
          mappedConfs = _.map confs, (conf) ->
            new Conf(conf)
          env.confs mappedConfs
    self.openConfs = (env) ->
      self.confs env.confs()
       
    return
  ko.applyBindings new ViewModel()
