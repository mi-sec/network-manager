/** ****************************************************************************************************
 * @file: kill.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

module.exports.method = 'GET';
module.exports.route  = '/kill';
module.exports.exec   = ( req, res ) => {
	res.status( 200 ).json( 'server terminated' );

	if ( !req.query.dryRun ) {
		process.nextTick(
			() => process.exit( 0 )
		);
	}
};
