export default {
	async getScan( context, _id = '' ) {
		try {
			const data = await this.$api.getScan( _id );
			context.commit( 'commitScan', data );
		}
		catch ( e ) {
			console.error( e );
		}
	}
};
