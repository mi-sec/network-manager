/** ****************************************************************************************************
 * @file: statusCode.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 04-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' );

module.exports.method = 'GET';
module.exports.route  = '/dev/status/:statusCode';
module.exports.exec   = ( req, res ) => {
	const
		code = +req.params.statusCode;

	if ( Response.isHTTPCode( code ) ) {
		res.status( code ).json( Response.getMessageForCode( code ) );
	}
	else {
		res.status( 400 ).json( {
			name: 'BAD_REQUEST',
			msg: `${ code } is not a valid HTTP status code`
		} );
	}
};
