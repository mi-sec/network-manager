/** ****************************************************************************************************
 * @file: get.health.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2019
 *******************************************************************************************************/
'use strict';

const
	{ version } = require( 'config' );

module.exports.method = 'GET';
module.exports.route  = '/actuator/health';
module.exports.exec   = ( req, res ) => {
	res.status( 200 ).json( {
		status: 'UP',
		app: { version },
		dependencyHealth: {}
	} );
};
