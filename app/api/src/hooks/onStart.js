/** ****************************************************************************************************
 * @file: onStart.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config           = require( 'config' ),
	{ promises: fs } = require( 'fs' ),
	state            = require( '../services/state' );

module.exports = async () => {
	state.shuttingDown = false;

	try {
		await fs.stat( config.get( 'storage' ) );
	}
	catch ( e ) {
		if ( e.code === 'ENOENT' ) {
			await fs.mkdir( config.get( 'storage' ), { recursive: true } );
		}
		else {
			console.error( e );
		}
	}
};
