/** ****************************************************************************************************
 * @file: config.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 12-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config = require( 'config' ),
	set    = require( 'lodash.set' );

module.exports.method = 'GET';
module.exports.route  = '/config';
module.exports.exec   = ( req, res ) => {
	if ( !req.query.key ) {
		res.status( 200 ).json( config );
	}
	else {
		if ( !Array.isArray( req.query.key ) ) {
			req.query.key = req.query.key.split( ',' ).map( ( i ) => i.trim() );
		}

		const
			missing = [],
			resp    = {};

		for ( let i = 0; i < req.query.key.length; i++ ) {
			const item = req.query.key[ i ];
			if ( !config.has( item ) ) {
				missing.push( item );
			}
			else {
				set( resp, item, config.get( item ) );
			}
		}

		if ( missing.length ) {
			res
				.status( 400 )
				.json( {
					name: 'INVALID_KEY',
					msg: `${ missing.join( ', ' ) } does not exist`
				} );
		}
		else {
			res.status( 200 ).json( resp );
		}
	}
};
