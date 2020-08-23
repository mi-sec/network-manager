/** ****************************************************************************************************
 * @file: index.test.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Mar-2019
 *******************************************************************************************************/
'use strict';

process.env.NODE_ENV = 'testing';
process.env.TESTING  = true;

process.env.API_PORT = 3001;

const
	chai                     = require( 'chai' ),
	chaiHttp                 = require( 'chai-http' ),
	{ expect }               = chai,
	{ join }                 = require( 'path' ),
	{ promises: fs }         = require( 'fs' ),
	LightMap                 = require( '@mi-sec/lightmap' ),
	recursivelyReadDirectory = require( '../src/utils/recursivelyReadDirectory' ),
	{
		name,
		version
	}                        = require( '../package' );

process.env.API_STORAGE = join( __dirname, 'test_storage' );

const
	utilTests = require( './utils/utils.test' );

chai.use( chaiHttp );

const
	onStart = require( '../src/hooks/onStart' ),
	onStop  = require( '../src/hooks/onStop' );

let server, app;

before( function( done ) {
	this.timeout( 5000 );

	( async () => {
		console.log( 'waiting for services' );
		await onStart();

		const Server = require( '../src/core/Server' );
		server       = new Server();

		server.meters          = {};
		server.meters.reqMeter = {
			mark: () => {
			}
		};

		await server.initialize();
		server.onStart( () => {
			app = server.server;
			done();
		} );
	} )();
} );

describe( 'utilities test', utilTests.bind( this ) );

describe( `${ name } v${ version }`, async function() {
	// WARNING::: do not remove this test - the tests will not work.
	// These tests are dynamically pulled in and ran; because mocha sees no tests if this isn't here, it won't run
	it( 'test', () => expect( 1 ).to.eq( 1 ) );

	it( 'onStart should create a storage path', async () => {
		const dir = await fs.stat( process.env.API_STORAGE );
		expect( dir ).to.be.an( 'object' );
		expect( dir.isDirectory() ).to.eq( true );
	} );

	const
		routes = await recursivelyReadDirectory( join( __dirname, 'routes' ) ),
		groups = new LightMap();

	routes.forEach(
		route => {
			const test    = require( `${ route }` );
			const context = test.context || 'TEST';
			if ( !groups.has( context ) ) {
				groups.set( context, [] );
			}

			groups.get( context ).push( ...test );
		}
	);

	groups.forEach(
		( v, k ) => {
			context( k, function() {
				v.forEach(
					t => it( t.description, function( done ) {
						this.timeout( 3000 );
						t.exec( app, done );
					} )
				);
			} );
		}
	);
} );

after( async () => {
	await onStop();
	await fs.rmdir( process.env.API_STORAGE );

	process.nextTick(
		() => setTimeout( () => process.exit( 0 ), 2000 )
	);
} );
