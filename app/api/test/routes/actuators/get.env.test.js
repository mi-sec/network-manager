const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /actuator/env',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/actuator/env' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'object' );

					expect( res.body ).to.have.property( 'NODE' );

					expect( res.body ).to.have.property( 'NODE_ENV' )
						.and.eq( 'testing' );

					done();
				} );
		}
	}
];

module.exports.context = 'ACTUATOR HEALTH ROUTES';
