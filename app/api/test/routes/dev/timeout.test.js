const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /dev/timeout/:time',
		exec: ( app, done ) => {
			const start = Date.now();

			chai
				.request( app )
				.get( '/dev/timeout/0.2' )
				.end( ( err, res ) => {
					const end = Date.now() - start;
					expect( res ).to.have.status( 408 );
					expect( end ).to.be.gte( 200 );
					expect( end ).to.be.lt( 250 );
					done();
				} );
		}
	},
	{
		description: 'GET /dev/timeout/0',
		exec: ( app, done ) => {
			const start = Date.now();

			chai
				.request( app )
				.get( '/dev/timeout/0' )
				.end( ( err, res ) => {
					const end = Date.now() - start;
					expect( res ).to.have.status( 408 );
					expect( end ).to.be.gte( 2000 );
					expect( end ).to.be.lt( 2050 );
					done();
				} );
		}
	},
	{
		description: 'GET /dev/timeout/:time (bad request)',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/dev/timeout/a' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 422 );
					expect( res.body ).to.have.property( 'name' ).and.eq( 'VALIDATION_ERROR' );
					expect( res.body ).to.have.property( 'msg' ).and.be.an( 'array' );
					expect( res.body.msg[ 0 ] )
						.to.have.property( 'message' )
						.and.satisfy( ( d ) => d.startsWith( '"time" with value "a" fails' ) );

					done();
				} );
		}
	}
];

module.exports.context = 'DEVELOPER ROUTES';
