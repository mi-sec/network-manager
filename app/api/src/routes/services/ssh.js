/** ****************************************************************************************************
 * @file: ssh.js
 * @project: network-manager
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 23-Aug-2020
 *******************************************************************************************************/
'use strict';

const
	config    = require( 'config' ),
	validator = require( 'validator' );

module.exports.method = 'ALL';
module.exports.route  = [
	'/services/ssh',
	'/services/ssh/:host'
];
module.exports.exec   = ( req, res ) => {
	console.log( 'we here' );
	const host = '' + ( req.params.host || req.query.host );

	req.session.ssh = {
		host: (
			( validator.isIP( host + '' ) && host ) ||
			( validator.isFQDN( host ) && host ) ||
			( /^(([a-z]|[A-Z]|[0-9]|[!^(){}\-_~])+)?\w$/.test( host ) && host )
		),
		port: (
			( validator.isInt( req.query.port + '', { min: 1, max: 65535 } ) && req.query.port ) ||
			config.get( 'ssh.server.port' )
		),
		header: {
			name: req.query.header || config.get( 'ssh.header' ),
			background: req.query.headerBackground || config.get( 'ssh.headerBackground' )
		},
		localAddress: config.get( 'ssh.server.localAddress' ),
		localPort: config.get( 'ssh.server.localPort' ),
		algorithms: config.get( 'ssh.algorithms' ),
		keepaliveInterval: config.get( 'ssh.server.keepaliveInterval' ),
		keepaliveCountMax: config.get( 'ssh.server.keepaliveCountMax' ),
		allowedSubnets: config.get( 'ssh.server.allowedSubnets' ),
		term: (
			( /^(([a-z]|[A-Z]|[0-9]|[!^(){}\-_~])+)?\w$/.test( req.query.sshterm ) && req.query.sshterm ) ||
			config.get( 'ssh.server.term' )
		),
		terminal: {
			cursorBlink: (
				validator.isBoolean( req.query.cursorBlink + '' ) ?
					req.query.cursorBlink :
					config.get( 'ssh.terminal.cursorBlink' )
			),
			scrollback: (
				( validator.isInt( req.query.scrollback + '', { min: 1, max: 200000 } ) && req.query.scrollback ) ?
					req.query.scrollback :
					config.get( 'ssh.terminal.scrollback' )
			),
			tabStopWidth: (
				( validator.isInt( req.query.tabStopWidth + '', { min: 1, max: 100 } ) && req.query.tabStopWidth ) ?
					req.query.tabStopWidth :
					config.get( 'ssh.terminal.tabStopWidth' )
			),
			bellStyle: (
				( ( req.query.bellStyle ) && ( [ 'sound', 'none' ].indexOf( req.query.bellStyle ) > -1 ) ) ?
					req.query.bellStyle :
					config.get( 'ssh.terminal.bellStyle' )
			)
		},
		allowreplay: (
			config.get( 'ssh.options.challengeButton' ) || (
				validator.isBoolean( req.headers.allowreplay + '' ) ?
					(
						req.headers.allowreplay ?
							( '' + req.headers.allowreplay.toLowerCase() ) === 'true' :
							false
					) :
					false
			)
		),
		allowreauth: config.get( 'ssh.options.allowreauth' ) || false,
		mrhsession: (
			( validator.isAlphanumeric( req.headers.mrhsession + '' ) && req.headers.mrhsession ) ?
				req.headers.mrhsession :
				'none'
		),
		serverlog: {
			client: config.get( 'ssh.serverlog.client' ) || false,
			server: config.get( 'ssh.serverlog.server' ) || false
		},
		readyTimeout: (
			( validator.isInt( req.query.readyTimeout + '', { min: 1, max: 300000 } ) && req.query.readyTimeout ) ||
			config.get( 'ssh.server.readyTimeout' )
		)
	};

	if ( req.session.ssh.header.name ) {
		validator.escape( req.session.ssh.header.name );
	}

	if ( req.session.ssh.header.background ) {
		validator.escape( req.session.ssh.header.background );
	}
};
