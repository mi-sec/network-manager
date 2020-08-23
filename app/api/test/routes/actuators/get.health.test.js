const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai,
	{ join }   = require( 'path' ),
	pack       = require( join( process.cwd(), 'package.json' ) );

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /actuator/health',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/actuator/health' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'object' );

					expect( res.body ).to.have.property( 'status' )
						.and.eq( 'UP' );

					expect( res.body ).to.have.property( 'app' );
					expect( res.body.app ).to.have.property( 'version' )
						.and.eq( `v${ pack.version }` )
						.and.to.match(
						/\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/ig );

					expect( res.body ).to.have.property( 'dependencyHealth' ).and.be.an( 'object' );

					done();
				} );
		}
	}
];

module.exports.context = 'ACTUATOR HEALTH ROUTES';
