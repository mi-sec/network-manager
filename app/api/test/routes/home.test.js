const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai,
	{ join }   = require( 'path' ),
	pack       = require( join( process.cwd(), 'package.json' ) );

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'object' );

					expect( res.body ).to.have.property( 'name' )
						.and.eq( pack.name );

					expect( res.body ).to.have.property( 'version' )
						.and.eq( `v${ pack.version }` );

					expect( res.body.version ).to.match(
						/\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/ig
					);

					done();
				} );
		}
	}
];

module.exports.context = 'CORE';
