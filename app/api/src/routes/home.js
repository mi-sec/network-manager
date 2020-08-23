/** ****************************************************************************************************
 * @file: home.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	{ name, version } = require( 'config' );

module.exports.method = 'GET';
module.exports.route  = '/';
module.exports.exec   = ( req, res ) => {
	res.status( 200 ).json( { name, version } );
};
