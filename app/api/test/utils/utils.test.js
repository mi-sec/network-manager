const
	chai       = require( 'chai' ),
	{ expect } = chai,
	utils      = require( '../../src/utils/index' );

module.exports = function() {
	it( 'isNaN', () => {
		expect( utils.isNaN( NaN ) ).to.eq( true );
		expect( utils.isNaN( 1 ) ).to.eq( false );
		expect( utils.isNaN( true ) ).to.eq( false );
		expect( utils.isNaN( undefined ) ).to.eq( false );
		expect( utils.isNaN( null ) ).to.eq( false );

		expect( utils.isNaN( NaN, NaN ) ).to.eq( true );
		expect( utils.isNaN( 1, NaN ) ).to.eq( false );
		expect( utils.isNaN( NaN, NaN, true ) ).to.eq( false );
	} );

	it( 'isUndefined', () => {
		expect( utils.isUndefined( NaN ) ).to.eq( false );
		expect( utils.isUndefined( 1 ) ).to.eq( false );
		expect( utils.isUndefined( true ) ).to.eq( false );
		expect( utils.isUndefined( undefined ) ).to.eq( true );
		expect( utils.isUndefined( null ) ).to.eq( false );

		expect( utils.isUndefined( undefined, undefined ) ).to.eq( true );
		expect( utils.isUndefined( 1, undefined ) ).to.eq( false );
		expect( utils.isUndefined( undefined, undefined, true ) ).to.eq( false );
	} );

	it( 'isNull', () => {
		expect( utils.isNull( NaN ) ).to.eq( false );
		expect( utils.isNull( 1 ) ).to.eq( false );
		expect( utils.isNull( true ) ).to.eq( false );
		expect( utils.isNull( undefined ) ).to.eq( false );
		expect( utils.isNull( null ) ).to.eq( true );

		expect( utils.isNull( null, null ) ).to.eq( true );
		expect( utils.isNull( 1, null ) ).to.eq( false );
		expect( utils.isNull( null, null, false ) ).to.eq( false );
	} );

	it( 'isBoolean', () => {
		expect( utils.isBoolean( NaN ) ).to.eq( false );
		expect( utils.isBoolean( 1 ) ).to.eq( false );
		expect( utils.isBoolean( true ) ).to.eq( true );
		expect( utils.isBoolean( undefined ) ).to.eq( false );
		expect( utils.isBoolean( null ) ).to.eq( false );

		expect( utils.isBoolean( true, false ) ).to.eq( true );
		expect( utils.isBoolean( 1, false ) ).to.eq( false );
		expect( utils.isBoolean( true, false, null ) ).to.eq( false );
	} );

	it( 'isString', () => {
		expect( utils.isString( true ) ).to.eq( false );
		expect( utils.isString( 100 ) ).to.eq( false );
		expect( utils.isString( 'string' ) ).to.eq( true );

		expect( utils.isString( 'string', 'string' ) ).to.eq( true );
		expect( utils.isString( 100, 'string' ) ).to.eq( false );
		expect( utils.isString( 'string', true ) ).to.eq( false );
	} );

	it( 'isNumber', () => {
		expect( utils.isNumber( true ) ).to.eq( false );
		expect( utils.isNumber( 100 ) ).to.eq( true );
		expect( utils.isNumber( 'string' ) ).to.eq( false );

		expect( utils.isNumber( 100, 100 ) ).to.eq( true );
		expect( utils.isNumber( 100, 'string' ) ).to.eq( false );
		expect( utils.isNumber( 'string', true ) ).to.eq( false );
	} );

	it( 'isPrimitive', () => {
		expect( utils.isPrimitive( true ) ).to.eq( true );
		expect( utils.isPrimitive( 100 ) ).to.eq( true );
		expect( utils.isPrimitive( 'string' ) ).to.eq( true );
		expect( utils.isPrimitive( [] ) ).to.eq( false );
		expect( utils.isPrimitive( {} ) ).to.eq( false );

		expect( utils.isPrimitive( true, 1, 'a' ) ).to.eq( true );
		expect( utils.isPrimitive( true, 1, 'a', [] ) ).to.eq( false );
		expect( utils.isPrimitive( {}, true, 1, 'a' ) ).to.eq( false );
	} );

	it( 'isArray', () => {
		expect( utils.isArray( 'string' ) ).to.eq( false );
		expect( utils.isArray( [] ) ).to.eq( true );
		expect( utils.isArray( {} ) ).to.eq( false );

		expect( utils.isArray( [], [], [] ) ).to.eq( true );
		expect( utils.isArray( {}, [], [] ) ).to.eq( false );
		expect( utils.isArray( [], [], {} ) ).to.eq( false );
	} );

	it( 'isObject', () => {
		expect( utils.isObject( 'string' ) ).to.eq( false );
		expect( utils.isObject( [] ) ).to.eq( false );
		expect( utils.isObject( {} ) ).to.eq( true );

		expect( utils.isObject( {}, {}, {} ) ).to.eq( true );
		expect( utils.isObject( {}, [], [] ) ).to.eq( false );
		expect( utils.isObject( [], [], {} ) ).to.eq( false );
	} );

	it( 'isBuffer', () => {
		const buf = Buffer.from( 'string' );
		expect( utils.isBuffer( 'string' ) ).to.eq( false );
		expect( utils.isBuffer( buf ) ).to.eq( true );

		expect( utils.isBuffer( buf, buf, buf ) ).to.eq( true );
		expect( utils.isBuffer( {}, buf, buf ) ).to.eq( false );
		expect( utils.isBuffer( buf, buf, {} ) ).to.eq( false );
	} );

	it( 'isFunction', () => {
		const func  = () => {
		};
		const func2 = function() {
		};
		expect( utils.isFunction( 'string' ) ).to.eq( false );
		expect( utils.isFunction( func ) ).to.eq( true );
		expect( utils.isFunction( func2 ) ).to.eq( true );

		expect( utils.isFunction( func, func2, func, func2 ) ).to.eq( true );
		expect( utils.isFunction( {}, func, func2 ) ).to.eq( false );
		expect( utils.isFunction( func, func2, {} ) ).to.eq( false );
	} );

	it( 'isValue', () => {
		expect( utils.isValue( NaN ) ).to.eq( false );
		expect( utils.isValue( undefined ) ).to.eq( false );
		expect( utils.isValue( null ) ).to.eq( false );
		expect( utils.isValue( true ) ).to.eq( true );
		expect( utils.isValue( false ) ).to.eq( true );
		expect( utils.isValue( 100 ) ).to.eq( true );
		expect( utils.isValue( 'string' ) ).to.eq( true );

		expect( utils.isValue( true, false, 100, 'string' ) ).to.eq( true );
		expect( utils.isValue( [], {}, Symbol() ) ).to.eq( true );
		expect( utils.isValue( {}, true, NaN ) ).to.eq( false );
		expect( utils.isValue( undefined, null, 100 ) ).to.eq( false );
		expect( utils.isValue( NaN, undefined, null ) ).to.eq( false );
	} );

	it( 'wait', async () => {
		const x   = Date.now();
		const val = await utils.wait( 500, 'abc' );
		const y   = Date.now();

		expect( y - x ).to.satisfy( ( n ) => n >= 500 && n < 600 );
		expect( val ).to.eq( 'abc' );
		expect( () => utils.wait( 'abc' ) ).to.throw( 'Argument Error - expected number' );
	} );

	it( 'bytesToSize', async () => {
		expect( utils.bytesToSize() ).to.eq( '0 Byte' );
		expect( utils.bytesToSize( 1073741824 ) ).to.eq( '1 GB' );
	} );
};
