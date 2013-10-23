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
      @isActive = ko.observable(data.active)
      @isNotActive = ko.observable(data.active)

  class Env 
    constructor: (data) ->
      @name = ko.observable(data.name)
      @appId = data.appId
      @id = data.id
      @isActive = ko.observable(data.active)
      @isNotActive = ko.observable(data.active)
      @confs = ko.observableArray([])

  class Conf
    constructor: (data) ->
      @id = data.id
      @baseConfig = data.baseConfig
      @data = data.data
      @envId = data.envId


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
    self.appInfoModal = (app) ->
      console.log app
    self.changeApp = (app) ->
      console.log app
    self.deleteApp = (app) ->
      viewModel.modal.show true
      data = {id:app.id}
      console.log 'app'
      console.log app
      # socket.delete "/application",data, (res) ->
        # self.apps.remove app  
    self.addApp = () ->
      data = {name: this.newAppName(), active: this.isActive(), userID: ch.user.id}
      socket.post "/application/create",data, (app) ->
        self.apps.push( new App(data) )
    self.openApp = (app) -> 
      self.appInfo true
      self.appName(app.name)
      data = {
        "where":{
          "appId":app.id
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
          "appId":env.appId,
          "envId":env.id
          }
        }
        socket.post "/configuration/find", data, (confs) ->
          console.log confs
          mappedConfs = _.map confs, (conf) ->
            new Conf(conf)
          env.confs mappedConfs
    self.openConfs = (env) ->
      self.confs env.confs()
    self.showDiffConf = (e)->
      container = document.getElementById("jsoneditor")
      console.log container
      json = editor.get()
    self.openConf = (conf) ->
      container = document.getElementById("jsoneditor")
      editor = new jsoneditor.JSONEditor(container)
      editor.set conf.data
      # get json
      
      $('#showConf').modal('show');
      console.log conf
    return
  viewModel = new ViewModel()
  ko.applyBindings viewModel

  # getting data
  socket.get "/application", (apps) ->
    mappedApps = _.map apps, (app) ->
      new App(app)
    viewModel.apps mappedApps
  #listening socket for new apps
  socket.on "message", (data) ->
    if data.model is "application"
      viewModel.apps.push(new App(data.data))
    if data.model is "configuration"
      #rewrite this
      return

