/** ****************************************************************************************************
 * @file: ping.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

module.exports.method = 'ALL';
module.exports.route  = '/ping';
module.exports.exec   = ( req, res ) => {
	res.status( 200 ).json( 'pong' );
};
