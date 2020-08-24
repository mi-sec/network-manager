/** ****************************************************************************************************
 * @file: packet.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	{ v4: UUIDv4 } = require( 'uuid' );

/**
 * packet
 * @description
 * construct basic wrapper operations for consistent api responses
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @param {function} next - next middleware function
 */
function packet( req, res, next ) {
	req.log.info( '[middleware] packet' );

	const id = UUIDv4();

	req.rid = id;
	res.set( 'request-id', id );

	next();
}

module.exports = () => packet;
