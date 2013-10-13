/**
 * Session
 *
 * Sails session integration leans heavily on the great work already done by Express, but also unifies
 * Socket.io with the Connect session store. It uses Connect's cookie parser to normalize configuration
 * differences between Express and Socket.io and hooks into Sails' middleware interpreter to allow you
 * to access and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.session = {

	// Session secret is automatically generated when your new app is created
	// Replace at your own risk in production-- you will invalidate the cookies of your users,
	// forcing them to log in again. 
	secret: 'ee465b65af6e51a9fab8ecbb9416ab8f',

	// In production, uncomment the following lines to set up a shared redis session store
	// that can be shared across multiple Sails.js servers
	adapter: 'redis',
	//
	// The following values are optional, if no options are set a redis instance running
	// on localhost is expected.
	// Read more about options at: https://github.com/visionmedia/connect-redis

	host: 'localhost',
	port: 6379,
	// host: 'dmaricic.com',
	// port: 6379,
	// ttl: 15000,
	// db: 0,
	// pass: 'wWSVeTz6L2i18am6alTfzyrNSIanxWZHYIHJYlNm8i30JXQnWxrpNKEcR7/0k7AsdXKoc8yoOqLN+JoJZadzaydEPIFyX0uKNV/46mAylDNSwIuuUaIF0Kl7l5w6OUacPJQyMw==',
	// prefix: 'session:'

	// host: 'dmaricic.com',
	// port: 6379,
	// ttl: 15000,
	// db: 1,
	// prefix: 'sess:'

	// Uncomment the following lines to use your Mongo adapter as a session store
	// adapter: 'mongo',
	//
	// host: 'localhost',
	// port: 27017,
	// db: 'sails',
	// collection: 'sessions',
	//
	// Optional Values:
	//
	// # Note: url will override other connection settings
	// url: 'mongodb://user:pass@host:port/database/collection',
	//
	// username: '',
	// password: '',
	// auto_reconnect: false,
	// ssl: false,
	// stringify: true

};