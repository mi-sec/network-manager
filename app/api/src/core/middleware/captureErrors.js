/** ****************************************************************************************************
 * @file: captureErrors.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	UUIDv4 = require( 'uuid/v4' );

/**
 * captureErrors
 * @description
 * capture any errors that may occur - should be last middleware function in the request cycle
 * @param {Error|null} e - null unless an error occurs
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @param {function} next - next middleware function
 */
function captureErrors( e, req, res, next ) {
	req.log.trace( '[middleware] captureErrors', e );

	if ( e ) {
		if ( res.finished || res._headerSent ) {
			req.log.trace( '[middleware] captureErrors', 'captured dead request' );
			return;
		}

		res
			.set( {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Max-Age': 1728000,
				'Content-Type': 'application/json; charset=utf-8',
				'request-id': req.rid || UUIDv4()
			} )
			.status( e.statusCode || 500 )
			.json( {
				type: e.type,
				name: e.name || 'UNKNOWN',
				msg: e.message
			} );
	}
	else {
		next();
	}
}

module.exports = () => captureErrors;
