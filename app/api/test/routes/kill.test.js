const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /kill',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/kill' )
				.query( { dryRun: true } )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.a( 'string' );
					expect( res.body ).to.eq( 'server terminated' );

					done();
				} );
		}
	}
];

module.exports.context = 'CORE';
