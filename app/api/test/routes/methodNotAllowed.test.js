const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /badmethod',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/badmethod' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 405 );
					expect( res.body ).to.be.an( 'object' );
					expect( res.body ).to.have.property( 'type' ).and.eq( 'CLIENT_ERROR' );
					expect( res.body ).to.have.property( 'name' ).and.eq( 'METHOD_NOT_ALLOWED' );
					expect( res.body ).to.have.property( 'msg' ).and.eq( 'Method: GET on /badmethod not allowed' );

					done();
				} );
		}
	}
];

module.exports.context = 'CORE';
