import { join } from 'path';

export default {
	async getConfig( context ) {
		this.$logger.info( 'action.getConfig' );
		try {
			const
				configUrl = new URL( join( this.state.route.fullPath, 'config.json' ), window.location.origin ),
				{ data }  = await this.$axios.get( configUrl );
			context.commit( 'commitConfig', data );
		}
		catch ( e ) {
			this.$logger.error( e );
		}
	}
};
