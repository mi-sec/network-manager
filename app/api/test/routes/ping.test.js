const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /ping',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/ping' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'string' );
					expect( res.body ).to.eq( 'pong' );

					done();
				} );
		}
	}
];

module.exports.context = 'CORE';
