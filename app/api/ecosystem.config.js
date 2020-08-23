/** ****************************************************************************************************
 * @file: ecosystem.config.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 28-Jan-2019
 *******************************************************************************************************/
'use strict';

const
	{ name }     = require( './package.json' ),
	{ resolve }  = require( 'path' ),
	isProduction = process.argv.includes( 'production' );

const apps = [
	{
		name,
		script: resolve( __dirname, './src/entrypoint.js' ),
		exec_mode: 'cluster',
		instances: isProduction ? 0 : 1,
		instance_var: 'INSTANCE_ID',
		wait_ready: true,
		autorestart: true,
		restartDelay: 5000,
		watch: !isProduction,
		ignore_watch: [ 'storage' ],
		max_memory_restart: '1G',
		node_args: [
			'--no-warnings',
			'--max-old-space-size=8192'
		],
		env: {
			NODE_ENV: 'development'
		},
		env_production: {
			NODE_ENV: 'production'
		}
	}
];

module.exports = { apps };
