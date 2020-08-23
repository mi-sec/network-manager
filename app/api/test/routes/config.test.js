const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai,
	{ join }   = require( 'path' ),
	pack       = require( join( process.cwd(), 'package.json' ) );

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /config',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/config' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'object' );

					expect( res.body ).to.have.property( 'name' )
						.and.eq( pack.name );

					expect( res.body ).to.have.property( 'description' )
						.and.eq( pack.description );

					expect( res.body ).to.have.property( 'version' )
						.and.eq( `v${ pack.version }` );

					expect( res.body ).to.not.have.property( 'secret' );

					done();
				} );
		}
	},
	{
		description: 'GET /config?key=name&key=version',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/config' )
				.query( { key: [ 'name', 'version' ] } )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'object' );

					expect( res.body ).to.have.property( 'name' )
						.and.eq( pack.name );

					expect( res.body ).to.have.property( 'version' )
						.and.eq( `v${ pack.version }` );

					expect( res.body ).to.not.have.property( 'description' );
					expect( res.body ).to.not.have.property( 'secret' );

					done();
				} );
		}
	},
	{
		description: 'GET /config?key=server.host',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/config' )
				.query( { key: [ 'server.host' ] } )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'object' );

					expect( res.body ).to.have.property( 'server' )
						.and.be.an( 'object' )
						.and.have.property( 'host' )
						.and.be.a( 'string' )
						.and.eq( '0.0.0.0' );

					done();
				} );
		}
	}
];

module.exports.context = 'CORE';
