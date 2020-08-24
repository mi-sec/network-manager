/** ****************************************************************************************************
 * @file: server.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	config         = require( 'config' ),
	{ join }       = require( 'path' ),
	http           = require( 'http' ),
	express        = require( 'express' ),
	cors           = require( 'cors' ),
	bodyParser     = require( 'body-parser' ),
	expressSession = require( 'express-session' ),
	logger         = require( 'pino' )( {
		enabled: !process.env.TESTING,
		level: process.env.NODE_ENV === 'production' ? 'error' : 'trace'
	} ),
	expressPino    = require( 'express-pino-logger' ),
	SocketIO       = require( 'socket.io' );

const
	state                    = require( '../services/state' ),
	socket                   = require( '../services/socket' ),
	setupRoute               = require( './setupRoute' ),
	captureErrors            = require( './middleware/captureErrors' ),
	recursivelyReadDirectory = require( '../utils/recursivelyReadDirectory' );

/**
 * Server
 */
class Server
{
	constructor()
	{
		this.isClosed = false;
	}

	/**
	 * bindProcess
	 * @description
	 * bind the process to `SIGINT`, `SIGQUIT`, `SIGTERM`, `unhandledRejection`, `uncaughtException`, `beforeExit`,
	 * and `exit` program POSIX signal events to assist with safe shutdown
	 */
	bindProcess()
	{
		logger.info( 'bindProcess' );

		// catch all the ways node might exit
		process
			.on( 'SIGINT', ( msg, code ) => ( logger.info( 'SIGINT' ), process.exit( code || 0 ) ) )
			.on( 'SIGQUIT', ( msg, code ) => ( logger.info( 'SIGQUIT' ), process.exit( code || 0 ) ) )
			.on( 'SIGTERM', ( msg, code ) => ( logger.info( 'SIGTERM' ), process.exit( code || 0 ) ) )
			.on( 'unhandledRejection', ( err ) => logger.error( 'unhandledRejection', err ) )
			.on( 'uncaughtException', ( err ) => logger.error( 'uncaughtException', err ) )
			.on( 'beforeExit', () => logger.info( 'beforeExit' ) )
			.on( 'exit', () => logger.info( 'exit' ) );
	}

	/**
	 * expressInitialize
	 * @description
	 * Initialize express middleware and hook the middleware
	 */
	expressInitialize()
	{
		logger.info( 'expressInitialize' );

		this.app    = express();
		this.server = http.Server( this.app );

		this.app.use( expressPino( { logger } ) );
		this.app.set( 'trust proxy', 1 );
		this.app.disable( 'x-powered-by' );

		this.app.use( cors() );
		this.app.use( bodyParser.raw( { limit: '5gb' } ) );
		this.app.use( bodyParser.urlencoded( { extended: false } ) );
		this.app.use( bodyParser.text() );
		this.app.use( bodyParser.json() );

		this.session = expressSession( config.get( 'ssh.session' ) );

		this.app.use( '/docs', express.static( 'docs' ) );
	}

	socketInitialize()
	{
		const io = SocketIO(
			this.server,
			{
				serveClient: false,
				path: '/services/ssh/socket.io'
			}
		);

		io.use( ( socket, next ) => {
			( socket.request.res ) ?
				this.session( socket.request, socket.request.res, next ) :
				next( next );
		} );

		io.on( 'connection', socket );
	}

	/**
	 * hookRoute
	 * @param {object} item - item from the api config
	 * @returns {*} - returns item with required execution function
	 */
	hookRoute( item )
	{
		logger.info( `hookRoute ${ item.method } ${ item.route }` );

		// TODO::: add a hook to check for authentication if the handler file requires it
		const exec = [
			( req, res, next ) => ( this.meters.reqMeter.mark(), next() ),
			( req, res, next ) => state.shuttingDown ?
				res.status( 503 ).end( 'Service unavailable: Server shutting down' ) :
				next()
		];

		setupRoute( item, exec );

		// hook route to express
		this.app[ item.method ]( item.route, exec );

		return item;
	}

	routerInitialize()
	{
		logger.info( 'routerInitialize' );

		this.app.get( '/routes', ( req, res ) => {
			const routes = this.app._router.stack
				.filter( ( r ) => r.route && r.route.methods )
				.map( ( r ) => ( {
					path: r.route.path,
					methods: r.route.methods
				} ) );

			res.status( 200 ).json( routes );
		} );

		this.routes.map( ( item ) => this.hookRoute( item ) );

		// capture all unhandled routes
		this.app.all( '*', ( req, res ) => {
			res.status( 405 ).json( {
				type: 'CLIENT_ERROR',
				name: 'METHOD_NOT_ALLOWED',
				msg: `Method: ${ req.method } on ${ req.path } not allowed`
			} );
		} );

		// capture all unhandled errors that might occur
		this.app.use( captureErrors() );
	}

	async loadRoutes()
	{
		logger.info( 'loadRoutes' );

		this.routes = await recursivelyReadDirectory( join( process.cwd(), 'src', 'routes' ) );
		this.routes = this.routes.filter( ( route ) => /([a-z0-9\s_\\.\-():])+(.m?t?jsx?)$/i.test( route ) );
		this.routes = this.routes.map( ( route ) => require( `${ route }` ) );
		this.routes = this.routes.sort( ( a ) => a.method === 'HEAD' ? -1 : 0 );
	}

	/**
	 * initialize
	 * @description
	 * Hook `process` variables `uncaughtException`, `unhandledRejection`, and `exit` to handle any potential errors
	 * that may occur. This will allow us to properly handle exit and log all non-V8 level errors without the program
	 * crashing.
	 * @returns {Server} - this
	 */
	async initialize()
	{
		logger.info( 'initialize' );

		// override process handlers to handle failures
		if ( !process.env.TESTING ) {
			this.bindProcess();
		}

		// setup express
		this.expressInitialize();

		// setup socket.io
		this.socketInitialize();

		await this.loadRoutes();
		this.routerInitialize();
	}

	/**
	 * onStart
	 * @description
	 * create instance of an http server and start listening on the port
	 * @param {function} cb - pm2 callback
	 */
	onStart( cb )
	{
		logger.info( 'onStart' );

		this.server = this.app.listen(
			config.get( 'server.port' ),
			config.get( 'server.host' ),
			() => {
				logger.info( {
					name: config.get( 'name' ),
					version: config.get( 'version' ),
					host: config.get( 'server.host' ),
					port: config.get( 'server.port' )
				} );

				logger.info( 'started' );

				cb();
			}
		);
	}

	/**
	 * sensors
	 * @description
	 * PM2 managed function
	 * @param {*} io - PM2 managed argument
	 */
	sensors( io )
	{
		logger.info( 'sensors' );

		this.meters          = {};
		this.meters.reqMeter = io.meter( 'req/min' );
	}

	/**
	 * actuators
	 * @description
	 * PM2 managed function
	 * @param {*} io - PM2 managed argument
	 * @example
	 * pm2 trigger <app_id> process
	 */
	actuators( io )
	{
		logger.info( 'actuators' );

		// TODO::: add system info as actuator
		io.action( 'process', ( reply ) => reply( { env: process.env } ) );
		io.action( 'server', ( reply ) => reply( { server: this.server } ) );
		io.action( 'config', ( reply ) => reply( { config: config } ) );
	}

	/**
	 * onStop
	 * @param {*} err - error
	 * @param {function} cb - pm2 callback
	 * @param {number} code - exit code
	 * @param {string} signal - kill signal
	 */
	onStop( err, cb, code, signal )
	{
		logger.info( 'onStop' );

		if ( this.server ) {
			this.server.close();
		}

		if ( err ) {
			logger.error( err );
		}

		if ( this.isClosed ) {
			logger.debug( 'Shutdown after SIGINT, forced shutdown...' );
		}

		this.isClosed = true;

		logger.debug( `server exiting with code: ${ code } ${ signal }` );
		cb();
	}
}

/**
 * module.exports
 * @description
 * export a singleton instance of Server
 * @type {Server}
 */
module.exports = Server;
