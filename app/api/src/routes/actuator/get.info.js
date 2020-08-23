/** ****************************************************************************************************
 * @file: get.systemInfo.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2019
 *******************************************************************************************************/
'use strict';

const
	os         = require( 'os' ),
	systemInfo = require( '../../utils/systemInfo' );

module.exports.method = 'GET';
module.exports.route  = '/actuator/info';
module.exports.exec   = ( req, res ) => {
	res.status( 200 ).json( {
		status: 'UP',
		architecture: os.arch(),
		cpuInfo: systemInfo.cpuInfo(),
		cwd: process.cwd(),
		hostname: os.hostname(),
		memoryInfo: systemInfo.memoryInfo(),
		networkInterfaces: os.networkInterfaces(),
		nodeVersion: process.version,
		pid: process.pid,
		platform: os.platform(),
		ppid: process.ppid || 'unknown',
		runtimeVersion: process.versions,
		uptime: systemInfo.uptime(),
		userInfo: os.userInfo()
	} );
};
