const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai,
	Response   = require( 'http-response-class' );

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /dev/status/:statusCode (invalid code)',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/dev/status/600' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 400 );
					expect( res.body ).to.have.property( 'name' ).and.eq( 'BAD_REQUEST' );
					expect( res.body ).to.have.property( 'msg' ).and.eq( '600 is not a valid HTTP status code' );
					done();
				} );
		}
	},
	{
		description: 'GET /dev/status/:statusCode',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/dev/status/200' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.eq( Response.codes[ 200 ] );
					done();
				} );
		}
	},
	{
		description: 'GET /dev/status/:statusCode',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/dev/status/418' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 418 );
					expect( res.body ).to.eq( Response.codes[ 418 ] );
					done();
				} );
		}
	}
];

module.exports.context = 'DEVELOPER ROUTES';
