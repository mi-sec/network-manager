const
	chai       = require( 'chai' ),
	chaiHttp   = require( 'chai-http' ),
	{ expect } = chai;

chai.use( chaiHttp );

module.exports = [
	{
		description: 'GET /actuator/info',
		exec: ( app, done ) => {
			chai
				.request( app )
				.get( '/actuator/info' )
				.end( ( err, res ) => {
					expect( res ).to.have.status( 200 );
					expect( res.body ).to.be.an( 'object' );

					expect( res.body ).to.have.property( 'status' ).and.eq( 'UP' );

					expect( res.body ).to.have.property( 'architecture' ).and.be.a( 'string' );

					expect( res.body ).to.have.property( 'cpuInfo' ).and.be.an( 'object' );
					expect( res.body.cpuInfo ).to.have.property( 'cpu' ).and.be.a( 'string' );
					expect( res.body.cpuInfo ).to.have.property( 'cores' ).and.be.a( 'number' );
					expect( res.body.cpuInfo ).to.have.property( 'clockSpeed' ).and.be.a( 'string' );
					expect( res.body.cpuInfo ).to.have.property( 'times' ).and.be.an( 'object' );

					expect( res.body ).to.have.property( 'cwd' ).and.be.a( 'string' );
					expect( res.body ).to.have.property( 'hostname' ).and.be.a( 'string' );
					expect( res.body ).to.have.property( 'memoryInfo' ).and.be.an( 'object' );
					expect( res.body ).to.have.property( 'networkInterfaces' ).and.be.an( 'object' );
					expect( res.body ).to.have.property( 'nodeVersion' ).and.be.a( 'string' );
					expect( res.body ).to.have.property( 'pid' ).and.be.a( 'number' );
					expect( res.body ).to.have.property( 'platform' ).and.be.a( 'string' );
					expect( res.body ).to.have.property( 'ppid' ).and.be.a( 'number' );
					expect( res.body ).to.have.property( 'runtimeVersion' ).and.be.an( 'object' );

					expect( res.body ).to.have.property( 'uptime' ).and.be.an( 'object' );
					expect( res.body.uptime ).to.have.property( 'now' ).and.be.a( 'string' );
					expect( res.body.uptime ).to.have.property( 'system' ).and.be.an( 'object' );
					expect( res.body.uptime ).to.have.property( 'process' ).and.be.an( 'object' );

					expect( res.body ).to.have.property( 'userInfo' ).and.be.an( 'object' );

					done();
				} );
		}
	}
];

module.exports.context = 'ACTUATOR HEALTH ROUTES';
