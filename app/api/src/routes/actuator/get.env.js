/** ****************************************************************************************************
 * @file: get.env.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2019
 *******************************************************************************************************/
'use strict';

module.exports.method = 'GET';
module.exports.route  = '/actuator/env';
module.exports.exec   = ( req, res ) => {
	res.status( 200 ).json( process.env );
};
