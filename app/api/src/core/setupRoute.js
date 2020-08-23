/** ****************************************************************************************************
 * @file: setupRoute.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 19-Apr-2019
 *******************************************************************************************************/
'use strict';

const
	packet = require( './middleware/packet' )();

module.exports = ( item, exec = [] ) => {
	exec.push( packet );

	if ( Array.isArray( item.exec ) ) {
		exec.push( ...item.exec );
	}
	else {
		// must have all routes await or they won't always be caught by try
		exec.push(
			async ( req, res, next ) => {
				try {
					await item.exec( req, res, next );
				}
				catch ( e ) {
					res
						.status( e.statusCode || 500 )
						.json( {
							type: e.name,
							name: 'UNHANDLED_ROUTE_ERROR',
							msg: e.message
						} );
				}
			}
		);
	}

	item.method = item.method.toLowerCase();
};
