/** ****************************************************************************************************
 * @file: systemInfo.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2019
 *******************************************************************************************************/
'use strict';

const
	os = require( 'os' ),
	{
		bytesToSize
	}  = require( './index' );

function uptime() {
	const
		data      = {
			system: os.uptime(),
			process: process.uptime()
		},
		sysSince  = new Date( Date.now() - ( data.system * 1000 ) ).toUTCString(),
		procSince = new Date( Date.now() - ( data.process * 1000 ) ).toUTCString();

	return {
		now: new Date(),
		system: {
			sinceUTC: sysSince,
			sinceISO: new Date( sysSince ),
			seconds: data.system
		},
		process: {
			sinceUTC: procSince,
			sinceISO: new Date( procSince ),
			seconds: data.process
		}
	};
}

function cpuInfo() {
	const cpus = os.cpus();
	let data   = {
		cpu: cpus[ 0 ].model,
		cores: cpus.length,
		clockSpeed: 0,
		times: {
			user: 0,
			nice: 0,
			sys: 0,
			idle: 0,
			irq: 0,
			total: 0
		}
	};

	data = cpus.reduce(
		( r, i ) => {
			r.clockSpeed += i.speed;
			r.times.user += i.times.user;
			r.times.nice += i.times.nice;
			r.times.sys += i.times.sys;
			r.times.idle += i.times.idle;
			r.times.irq += i.times.irq;
			r.times.total += i.times.user + i.times.nice + i.times.sys + i.times.idle + i.times.irq;
			return r;
		}, data
	);

	// note: clock speed may not be readable when running in a docker container
	data.clockSpeed  = `${ data.clockSpeed / cpus.length } MHz`;
	data.times.user  = data.times.user / cpus.length;
	data.times.nice  = data.times.nice / cpus.length;
	data.times.sys   = data.times.sys / cpus.length;
	data.times.idle  = data.times.idle / cpus.length;
	data.times.irq   = data.times.irq / cpus.length;
	data.times.total = data.times.total / cpus.length;

	return data;
}

function memoryInfo() {
	const
		mem   = process.memoryUsage(),
		total = os.totalmem(),
		free  = os.freemem(),
		used  = ( ( mem.heapUsed / total ) * 100 ).toFixed( 3 ) + '%';

	mem.total = total;
	mem.free  = free;

	const memKeys = Object.keys( mem );

	for ( let i = 0; i < memKeys.length; i++ ) {
		mem[ memKeys[ i ] ] = bytesToSize( mem[ memKeys[ i ] ] );
	}

	mem.used = used;

	return mem;
}

module.exports = {
	uptime,
	cpuInfo,
	memoryInfo
};
