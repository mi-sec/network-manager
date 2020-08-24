export default {
	initializeStore( state ) {
		if ( localStorage.getItem( 'store' ) ) {
			this.replaceState(
				Object.assign( state, JSON.parse( localStorage.getItem( 'store' ) ) )
			);
		}
	}
};
