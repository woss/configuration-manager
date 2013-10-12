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

### Historical Configurations

Diff solutions

* https://npmjs.org/package/json-diff
* https://nodejsmodules.org/tags/diff
* https://github.com/benjamine/JsonDiffPatch = http://benjamine.github.io/JsonDiffPatch/demo/index.htm
* https://npmjs.org/package/diff = http://kpdecker.github.io/jsdiff/

_Versioning MONGODB_

http://support.mongohq.com/use-cases/document-versioning.html
 
  
### Versions 

#### _v0.1_

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