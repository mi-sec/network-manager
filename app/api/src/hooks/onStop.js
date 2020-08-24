/** ****************************************************************************************************
 * @file: onStop.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	state = require( '../services/state' );

module.exports = async () => {
	state.shuttingDown = true;
};
