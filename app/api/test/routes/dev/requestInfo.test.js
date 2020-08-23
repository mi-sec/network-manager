const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /dev/requestInfo?a=b',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/dev/requestInfo?a=b' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.have.property( 'id' ).and.to.match(
						/[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/i
					);
					expect( res.body ).to.have.property( 'path' ).and.eq( '/dev/requestInfo' );
					expect( res.body ).to.have.property( 'method' ).and.eq( 'GET' );
					expect( res.body ).to.have.property( 'params' ).and.deep.eq( {} );
					expect( res.body ).to.have.property( 'query' ).and.deep.eq( { a: 'b' } );
					done();
				} );
		}
	}
];

module.exports.context = 'DEVELOPER ROUTES';
