# Configuration Manager (CM)

## Description

First of all this is a project that i started on my own, as a need for mobile app that i am building.


CM is language independent manager of configurations for any application, mobile, backend system or fronted. 

CM is built on top of sailsJS framework, which natively supports http and web sockets protocols.

Problems that will be solved with CM (at least i see it like this) :

1. language independent
2. centralised
3. secure
4. it can be distributed
5. scales horizontally


### To be done

* dependency tracing for variables in confs 
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

### Versions 

#### _v0.1_

* added parsing of placeholders
* sample of confs
* refactoring of knockoutJS
* parsing placeholers `{+stuff+}`