const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /routes',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/routes' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'array' );

					res.body.forEach(
						route => {
							expect( route ).to.have.property( 'path' ).and.be.a( 'string' );
							expect( route ).to.have.property( 'methods' ).and.be.an( 'object' );
						}
					);

					done();
				} );
		}
	}
];

module.exports.context = 'CORE';
