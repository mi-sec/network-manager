/** ****************************************************************************************************
 * @file: version.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	{ version } = require( 'config' );

module.exports.method = 'GET';
module.exports.route  = '/version';
module.exports.exec   = ( req, res ) => {
	res.status( 200 ).json( version );
};
