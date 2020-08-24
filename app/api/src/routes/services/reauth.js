/** ****************************************************************************************************
 * @file: reauth.js
 * @project: network-manager
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 23-Aug-2020
 *******************************************************************************************************/
'use strict';

module.exports.method = 'GET';
module.exports.route  = '/services/ssh/reauth';
module.exports.exec   = ( req, res ) => {
	const doc = `
	<!DOCTYPE html>
	<html>
	<head>
	<meta http-equiv="refresh" content="0; url=${ req.headers.referer || '/' }">
	</head>
	<body style="background-color:#000"></body>
	</html>
	`;

	res
		.status( 401 )
		.send( doc );
};
