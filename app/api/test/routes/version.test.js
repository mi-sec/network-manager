const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai,
	{ join }   = require( 'path' ),
	pack       = require( join( process.cwd(), 'package.json' ) );

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /version',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/version' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.a( 'string' );
					expect( res.body ).to.match(
						/\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/ig
					);
					expect( res.body ).to.eq( `v${ pack.version }` );

					done();
				} );
		}
	}
];

module.exports.context = 'CORE';
