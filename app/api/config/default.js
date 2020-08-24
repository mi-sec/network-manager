/** ****************************************************************************************************
 * @file: default.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	{ v5: UUIDv5 }    = require( 'uuid' ),
	{ resolve, join } = require( 'path' ),
	{
		name,
		version,
		description
	}                 = require( '../package' );

process.env.API_PID_TITLE = process.env.API_PID_TITLE || `${ name }-v${ version }`;
process.title             = process.env.API_PID_TITLE;

const config = {
	name,
	version: `v${ version }`,
	description,
	title: process.env.API_PID_TITLE,

	ENV: process.env.ENV || 'development',
	NODE_ENV: process.env.NODE_ENV || 'development',

	storage: process.env.API_STORAGE ? resolve( process.env.API_STORAGE ) : join( process.cwd(), 'storage' ),

	server: {
		host: process.env.API_HOST || '0.0.0.0',
		port: +process.env.API_PORT || 3000,
		packet: {
			timeout: +process.env.SERVER_PACKET_TIMEOUT || 20000,
			dotfiles: process.env.SEND_FILE_ALLOW_DOT_FILES || 'allow'
		}
	},

	ssh: {
		listen: {
			ip: '0.0.0.0',
			port: 2222
		},
		user: {
			name: null,
			password: null,
			privatekey: null
		},
		server: {
			host: null,
			port: 22,
			localAddress: null,
			localPort: null,
			term: 'xterm-color',
			readyTimeout: 20000,
			keepaliveInterval: 120000,
			keepaliveCountMax: 10,
			allowedSubnets: []
		},
		terminal: {
			cursorBlink: true,
			scrollback: 10000,
			tabStopWidth: 8,
			bellStyle: 'sound'
		},
		header: {
			text: null,
			background: 'green'
		},
		session: {
			name: 'WebSSH2',
			secret: UUIDv5( process.env.API_PID_TITLE, UUIDv5.URL ),
			resave: true,
			saveUninitialized: false,
			unset: 'destroy'
		},
		options: {
			challengeButto: true,
			allowreaut: true
		},
		algorithms: {
			kex: [
				'ecdh-sha2-nistp256',
				'ecdh-sha2-nistp384',
				'ecdh-sha2-nistp521',
				'diffie-hellman-group-exchange-sha256',
				'diffie-hellman-group14-sha1'
			],
			cipher: [
				'aes128-ctr',
				'aes192-ctr',
				'aes256-ctr',
				'aes128-gcm',
				'aes128-gcm@openssh.com',
				'aes256-gcm',
				'aes256-gcm@openssh.com',
				'aes256-cbc'
			],
			hmac: [
				'hmac-sha2-256',
				'hmac-sha2-512',
				'hmac-sha1'
			],
			compress: [
				'none',
				'zlib@openssh.com',
				'zlib'
			]
		},
		serverlog: {
			client: false,
			server: false
		},
		accesslog: false,
		verify: false,
		safeShutdownDuration: 300
	}
};

module.exports = config;
