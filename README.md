[![Dependency Status](https://gemnasium.com/woss/configuration-manager.png)](https://gemnasium.com/woss/configuration-manager)

# Configuration Manager (CM)

## Description
First of all this is a project that i started on my own, as a need for mobile app that i am building.


CM is language independent manager of configurations for any application, mobile, backend system or fronted. 

CM is built on top of sailsJS framework, which natively supports http and web sockets protocols.

Problems that will be solved with CM (at least i see it like this) :

1. Programming language independent
2. Centralized 
3. Secure atm basic auth(OAuth in the future releases)
4. Distributed
5. MongoDB for persistent storage
6. Redis for session storage and caching


### To be done

* Prevent access to a conf based on IP of request sender
    * Example, if DEV conf is requested from PROD environment => should fail
* History tracking for configuration
  * Sources
    * https://github.com/thiloplanz/v7files/wiki/Vermongo **NOT**
    * http://mongoid.org/en/mongoid/docs/extras.html#versioning **NOT**
    * https://github.com/aq1018/mongoid-history **NOT**
    * http://hbase.apache.org/ **NOT**
* refactor conf
* UI 
  * Continue with Design
  * Use knockoutJS for building MVVM pattern
  * websockets only in UI
  * create Logo
  * optimize the JS
  * info on API
    * Each piece of info should give full API 
    * info panel for this
  * display API usage, calls for configs, not being tracked for UI calls
  * JSON validation (LINT and format)
* API calls record
  * Every time when call is made to get conf , api should be recorded
  * Each app can have small report for API usage


### I have made a mistake

It goes like this!!!!

Application -> Multiple Envs ONLY one BASE -> Multiple Confs Per ENV ONE BASE CONF IN BASE ENV

* Application
* ENVS
  * BASE _default_
    * BASE config _empty_ *can be editable*
  * ENV1 
    * CONF1
      * data  : ```{"some":"data"}```
  * ENV2
    * CONF1
      * data  : ```{"som1e":"dat1a"}```
    * CONF2
      * data  : ```{"some_other":"data"}```



### Historical Configurations

_Diff solutions_

* https://npmjs.org/package/json-diff
* https://nodejsmodules.org/tags/diff
* https://github.com/benjamine/JsonDiffPatch = http://benjamine.github.io/JsonDiffPatch/demo/index.htm
* https://npmjs.org/package/diff = http://kpdecker.github.io/jsdiff/

_Versioning MONGODB_

http://support.mongohq.com/use-cases/document-versioning.html


 
  
### Versions 

#### _v0.1_

* when configuration is activated store it and push it to redis
* added parsing of placeholders
* sample of confs
* refactoring of knockoutJS
* parsing placeholers `{+stuff+}`
* dependency tracking for variables in confs 
* make it like this- first level ones in array dependency are included  and tracked parsed, replacement occur after binding
  * root_path = `/path`
  * base_path = `{+/root_path+}/something` ==> 1st level dependency
  * some_path = `{+/base_path+}/something` ==> 2nd level dependency, should parse _base_path_ first
  * some_other_path = `{+/some_path+}/something` ==> same here
    * trace back placeHolder until no dependency
    * resolve root_path
    * resolve base_path
    * resolve some_path
    * resolve some_other_path


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/woss/configuration-manager/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

