/** ****************************************************************************************************
 * @file: validation.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	Joi = require( '@hapi/joi' );

/**
 * structs
 * @description
 * list of json structures used throughout the api
 * @mixin structs
 */
module.exports = {
	timeout: Joi.object( {
		time: Joi.string().regex( /^(?!0\d)\d*(\.\d+)?$/ )
	} ),
	// types,
	// struct,
	validate: ( expected, data ) => expected.validateAsync( data )
};
