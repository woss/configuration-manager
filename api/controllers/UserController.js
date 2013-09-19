/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	/* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
	showMyInfo: function (req, res)
	{
    res.json('oh noes!', 500);
	}

};