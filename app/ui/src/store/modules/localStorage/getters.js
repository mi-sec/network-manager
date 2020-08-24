export default {
	getScans( state ) {
		return state.scans.map(
			scan => {
				scan.config.plugins = scan.config.plugins
					.map( i => i.module )
					.join( ', ' );

				return scan;
			}
		);
	}
};
