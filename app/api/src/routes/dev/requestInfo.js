/** ****************************************************************************************************
 * @file: requestInfo.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 09-Aug-2020
 *******************************************************************************************************/
'use strict';

module.exports.method = 'ALL';
module.exports.route  = '/dev/requestInfo';
module.exports.exec   = ( req, res ) => {
	res
		.status( 200 )
		.json( {
			id: req.rid,
			path: req.path,
			method: req.method,
			params: req.params,
			query: req.query,
			cookies: req.cookies,
			data: req.body || req.data,
			requestHeaders: req.headers,
			ip: req.ip
		} );
};
