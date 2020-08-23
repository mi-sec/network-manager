'use strict';

function isNaN( ...n ) {
	return !n.filter( ( _n ) => ( _n === _n ) ).length;
}

function isUndefined( ...n ) {
	return !n.filter( ( _n ) => ( _n !== undefined ) ).length;
}

function isNull( ...n ) {
	return !n.filter( ( _n ) => ( _n !== null ) ).length;
}

function isBoolean( ...n ) {
	return !n.filter( ( _n ) => ( !!_n !== _n ) ).length;
}

function isString( ...n ) {
	return !n.filter( ( _n ) => ( '' + _n !== _n ) ).length;
}

function isNumber( ...n ) {
	return !n.filter( ( _n ) => ( +_n !== _n ) ).length;
}

function isPrimitive( ...n ) {
	return n.filter( ( _n ) => ( isBoolean( _n ) || isString( _n ) || isNumber( _n ) ) ).length === n.length;
}

function isArray( ...n ) {
	return n.filter( ( _n ) => Array.isArray( _n ) ).length === n.length;
}

function isObject( ...n ) {
	return n.filter( ( _n ) => !isArray( _n ) && typeof _n === 'object' ).length === n.length;
}

function isBuffer( ...n ) {
	return n.filter( ( _n ) => Buffer.isBuffer( _n ) ).length === n.length;
}

function isFunction( ...n ) {
	return n.filter( ( _n ) => typeof _n === 'function' ).length === n.length;
}

function isValue( ...n ) {
	return n.filter( ( _n ) => !( isNaN( _n ) || isUndefined( _n ) || isNull( _n ) ) ).length === n.length;
}

/**
 * wait
 * @description
 * similar to <code>usleep</code> in C++
 * @param {milliseconds} t - time to wait
 * @param {*} [v] - optional value to pass through when promise resolves
 * @returns {Promise<any>} - promise to be resolved in [t] milliseconds
 * @example
 * wait( 100, 'hello world' )
 *     .then() // -> will pass 'hello world' in 100ms
 */
function wait( t, v ) {
	if ( !isNumber( t ) ) {
		throw new Error( 'Argument Error - expected number' );
	}

	return new Promise(
		( res ) => setTimeout( () => res( v ), t )
	);
}

/**
 * bytesToSize
 * @description
 * Convert bytes to human readable format
 * @param {bytes} bytes - unit in bytes to parse
 * @returns {string} - pretty string in the format [n unit]
 * @example
 * bytesToSize( 1073741824 ) // -> 1 GB
 */
function bytesToSize( bytes ) {
	if ( !bytes ) {
		return '0 Byte';
	}

	const
		sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ],
		i     = ~~( Math.log( bytes ) / Math.log( 1024 ) );

	return Math.round( bytes / Math.pow( 1024, i ) ) + ' ' + sizes[ i ];
}

module.exports = {
	isNaN,
	isUndefined,
	isNull,
	isBoolean,
	isString,
	isNumber,
	isPrimitive,
	isArray,
	isObject,
	isBuffer,
	isFunction,
	isValue,
	wait,
	bytesToSize
};
