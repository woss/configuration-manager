# class Env 
#   constructor: (data) ->
#     @name = data.name
#     @active = data.active
#     @uuid = data.uuid
#     @id = data.id

# EnvListViewModel = ->
#   self = this
#   self.appInfo = false
#   self.envs = ko.observable([])
#   console.log self.envs()
#   self
# ko.applyBindings new EnvListViewModel(), $("#envList")[0]