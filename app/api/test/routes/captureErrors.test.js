const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'POST bad json input',
		exec: ( app, done ) => {
			chai
				.request( app )
				.post( '/ping' )
				.set( 'Content-Type', 'application/json' )
				.send( '{ "a": "b"' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 400 );
					expect( res.body ).to.be.an( 'object' );
					expect( res.body ).to.have.property( 'type' ).and.eq( 'entity.parse.failed' );
					expect( res.body ).to.have.property( 'name' ).and.eq( 'SyntaxError' );
					expect( res.body ).to.have.property( 'msg' ).and.eq( 'Unexpected end of JSON input' );
					done();
				} );
		}
	}
];

module.exports.context = 'CORE';
