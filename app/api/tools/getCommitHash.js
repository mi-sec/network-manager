/** ****************************************************************************************************
 * @file: getCommitHash.js
 * @project: template-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Nov-2019
 *******************************************************************************************************/
'use strict';

const
	process        = require( 'child_process' ),
	splitCharacter = '<##>';

const executeCommand = ( command, options ) => {
	return new Promise(
		( res, rej ) => {
			let dst = __dirname;

			if ( !!options && options.dst ) {
				dst = options.dst;
			}

			process.exec( command, { cwd: dst },
				( err, stdout, stderr ) => stdout === '' ?
					rej( 'this does not look like a git repo' ) :
					err || stderr ?
						rej( err || stderr ) :
						res( stdout )
			);
		}
	);
};

const prettyFormat = [ '%h', '%H', '%s', '%f', '%b', '%at', '%ct', '%an', '%ae', '%cn', '%ce', '%N', '' ];

const getCommandString = ( splitCharacter ) => `
git log -1 --pretty=format:"${ prettyFormat.join( splitCharacter ) }" &&
git rev-parse --abbrev-ref HEAD &&
git tag --contains HEAD
`;

const getLastCommit = async ( options ) => {
	const command = getCommandString( splitCharacter );
	const res     = await executeCommand( command, options );

	const
		a             = res.split( splitCharacter ),
		branchAndTags = a[ a.length - 1 ].split( '\n' ).filter( ( n ) => !!n ),
		branch        = branchAndTags[ 0 ],
		tags          = branchAndTags.slice( 1 );

	return {
		shortHash: a[ 0 ],
		hash: a[ 1 ],
		subject: a[ 2 ],
		sanitizedSubject: a[ 3 ],
		body: a[ 4 ],
		authoredOn: a[ 5 ],
		committedOn: a[ 6 ],
		author: {
			name: a[ 7 ],
			email: a[ 8 ]
		},
		committer: {
			name: a[ 9 ],
			email: a[ 10 ]
		},
		notes: a[ 11 ],
		branch,
		tags
	};
};

module.exports = getLastCommit;
