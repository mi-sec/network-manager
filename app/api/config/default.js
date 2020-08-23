/** ****************************************************************************************************
 * @file: default.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Mar-2019
 *******************************************************************************************************/
'use strict';

const
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
	}
};

module.exports = config;
