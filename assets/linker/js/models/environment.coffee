class Env 
  constructor: (data) ->
    @name = data.name

EnvListViewModel = ->
  self = this
ko.applyBindings new EnvListViewModel(), $("#envList")[0]