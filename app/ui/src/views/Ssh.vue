<template>
	<v-container>
		<v-flex xs12>
			<div class="box">
				<div id="header"></div>
				<div id="terminal-container" class="terminal"></div>
				<div id="bottomdiv">
					<div class="dropup" id="menu">
						<i class="fas fa-bars fa-fw"></i> Menu
						<div id="dropupContent" class="dropup-content"></div>
					</div>
					<div id="footer"></div>
					<div id="status"></div>
					<div id="countdown"></div>
				</div>
			</div>
		</v-flex>
	</v-container>
</template>

<script>
import url from 'url';

import * as io      from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
/* import * as fit from 'xterm/dist/addons/fit/fit' */

import { library, dom }                                  from '@fortawesome/fontawesome-svg-core';
import { faBars, faClipboard, faDownload, faKey, faCog } from '@fortawesome/free-solid-svg-icons';

export default {
	name: 'Ssh',
	mounted() {
		library.add( faBars, faClipboard, faDownload, faKey, faCog );
		dom.watch();

		/* global Blob, logBtn, credentialsBtn, reauthBtn, downloadLogBtn */
		var sessionLogEnable  = false;
		var loggedData        = false;
		var allowreplay       = false;
		var allowreauth       = false;
		var sessionLog, sessionFooter, logDate, currentDate, myFile, errorExists;
		var socket, termid; // eslint-disable-line
		const term            = new Terminal();
// DOM properties
		var status            = document.getElementById( 'status' );
		var header            = document.getElementById( 'header' );
		var dropupContent     = document.getElementById( 'dropupContent' );
		var footer            = document.getElementById( 'footer' );
		var countdown         = document.getElementById( 'countdown' );
		var fitAddon          = new FitAddon();
		var terminalContainer = document.getElementById( 'terminal-container' );
		term.loadAddon( fitAddon );
		term.open( terminalContainer );
		term.focus();
		fitAddon.fit();

		window.addEventListener( 'resize', resizeScreen, false );

		function resizeScreen() {
			fitAddon.fit();
			socket.emit( 'resize', { cols: term.cols, rows: term.rows } );
		}

		console.log( this.$store.state.api );
		const apiUrl = url.format( this.$store.state.api );

		socket = io.connect( apiUrl, {
			path: '/services/ssh/socket.io'
		} );

		term.onData( function( data ) {
			socket.emit( 'data', data );
		} );

		socket.on( 'data', function( data ) {
			term.write( data );
			if ( sessionLogEnable ) {
				sessionLog = sessionLog + data;
			}
		} );

		socket.on( 'connect', function() {
			socket.emit( 'geometry', term.cols, term.rows );
		} );

		socket.on( 'setTerminalOpts', function( data ) {
			term.setOption( 'cursorBlink', data.cursorBlink );
			term.setOption( 'scrollback', data.scrollback );
			term.setOption( 'tabStopWidth', data.tabStopWidth );
			term.setOption( 'bellStyle', data.bellStyle );
		} );

		socket.on( 'title', function( data ) {
			document.title = data;
		} );

		socket.on( 'menu', function( data ) {
			drawMenu( data );
		} );

		socket.on( 'status', function( data ) {
			status.innerHTML = data;
		} );

		socket.on( 'ssherror', function( data ) {
			status.innerHTML             = data;
			status.style.backgroundColor = 'red';
			errorExists                  = true;
		} );

		socket.on( 'headerBackground', function( data ) {
			header.style.backgroundColor = data;
		} );

		socket.on( 'header', function( data ) {
			if ( data ) {
				header.innerHTML               = data;
				header.style.display           = 'block';
				// header is 19px and footer is 19px, recaculate new terminal-container and resize
				terminalContainer.style.height = 'calc(100% - 38px)';
				resizeScreen();
			}
		} );

		socket.on( 'footer', function( data ) {
			sessionFooter    = data;
			footer.innerHTML = data;
		} );

		socket.on( 'statusBackground', function( data ) {
			status.style.backgroundColor = data;
		} );

		socket.on( 'allowreplay', function( data ) {
			if ( data === true ) {
				console.log( 'allowreplay: ' + data );
				allowreplay = true;
				drawMenu( dropupContent.innerHTML +
					'<a id="credentialsBtn"><i class="fas fa-key fa-fw"></i> Credentials</a>' );
			}
			else {
				allowreplay = false;
				console.log( 'allowreplay: ' + data );
			}
		} );

		socket.on( 'allowreauth', function( data ) {
			if ( data === true ) {
				console.log( 'allowreauth: ' + data );
				allowreauth = true;
				drawMenu(
					dropupContent.innerHTML + '<a id="reauthBtn"><i class="fas fa-key fa-fw"></i> Switch User</a>' );
			}
			else {
				allowreauth = false;
				console.log( 'allowreauth: ' + data );
			}
		} );

		socket.on( 'disconnect', function( err ) {
			if ( !errorExists ) {
				status.style.backgroundColor = 'red';
				status.innerHTML             =
					'WEBSOCKET SERVER DISCONNECTED: ' + err;
			}
			socket.io.reconnection( false );
			countdown.classList.remove( 'active' );
		} );

		socket.on( 'error', function( err ) {
			if ( !errorExists ) {
				status.style.backgroundColor = 'red';
				status.innerHTML             = 'ERROR: ' + err;
			}
		} );

		socket.on( 'reauth', function() {
			( allowreauth ) && reauthSession();
		} );

// safe shutdown
		var hasCountdownStarted = false;

		socket.on( 'shutdownCountdownUpdate', function( remainingSeconds ) {
			if ( !hasCountdownStarted ) {
				countdown.classList.add( 'active' );
				hasCountdownStarted = true;
			}

			countdown.innerText = 'Shutting down in ' + remainingSeconds + 's';
		} );

		term.onTitleChange( function( title ) {
			document.title = title;
		} );

// draw/re-draw menu and reattach listeners
// when dom is changed, listeners are abandonded
		function drawMenu( data ) {
			dropupContent.innerHTML = data;
			logBtn.addEventListener( 'click', toggleLog );
			allowreauth && reauthBtn.addEventListener( 'click', reauthSession );
			allowreplay && credentialsBtn.addEventListener( 'click', replayCredentials );
			loggedData && downloadLogBtn.addEventListener( 'click', downloadLog );
		}

// reauthenticate
		function reauthSession() { // eslint-disable-line
			console.log( 're-authenticating' );
			window.location.href = '/ssh/reauth';
			return false;
		}

// replay password to server, requires
		function replayCredentials() { // eslint-disable-line
			socket.emit( 'control', 'replayCredentials' );
			console.log( 'replaying credentials' );
			term.focus();
			return false;
		}

// Set variable to toggle log data from client/server to a varialble
// for later download
		function toggleLog() { // eslint-disable-line
			if ( sessionLogEnable === true ) {
				sessionLogEnable = false;
				loggedData       = true;
				logBtn.innerHTML = '<i class="fas fa-clipboard fa-fw"></i> Start Log';
				console.log( 'stopping log, ' + sessionLogEnable );
				currentDate = new Date();
				sessionLog  = sessionLog + '\r\n\r\nLog End for ' + sessionFooter + ': ' +
					currentDate.getFullYear() + '/' + ( currentDate.getMonth() + 1 ) + '/' +
					currentDate.getDate() + ' @ ' + currentDate.getHours() + ':' +
					currentDate.getMinutes() + ':' + currentDate.getSeconds() + '\r\n';
				logDate     = currentDate;
				term.focus();
				return false;
			}
			else {
				sessionLogEnable           = true;
				loggedData                 = true;
				logBtn.innerHTML           = '<i class="fas fa-cog fa-spin fa-fw"></i> Stop Log';
				downloadLogBtn.style.color = '#000';
				downloadLogBtn.addEventListener( 'click', downloadLog );
				console.log( 'starting log, ' + sessionLogEnable );
				currentDate = new Date();
				sessionLog  = 'Log Start for ' + sessionFooter + ': ' +
					currentDate.getFullYear() + '/' + ( currentDate.getMonth() + 1 ) + '/' +
					currentDate.getDate() + ' @ ' + currentDate.getHours() + ':' +
					currentDate.getMinutes() + ':' + currentDate.getSeconds() + '\r\n\r\n';
				logDate     = currentDate;
				term.focus();
				return false;
			}
		}

// cross browser method to "download" an element to the local system
// used for our client-side logging feature
		function downloadLog() { // eslint-disable-line
			if ( loggedData === true ) {
				myFile   = 'WebSSH2-' + logDate.getFullYear() + ( logDate.getMonth() + 1 ) +
					logDate.getDate() + '_' + logDate.getHours() + logDate.getMinutes() +
					logDate.getSeconds() + '.log';
				// regex should eliminate escape sequences from being logged.
				var blob = new Blob( [
					sessionLog.replace(
						/[\u001b\u009b][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><;]/g, '' )
				], { // eslint-disable-line no-control-regex
					type: 'text/plain'
				} );
				if ( window.navigator.msSaveOrOpenBlob ) {
					window.navigator.msSaveBlob( blob, myFile );
				}
				else {
					var elem      = window.document.createElement( 'a' );
					elem.href     = window.URL.createObjectURL( blob );
					elem.download = myFile;
					document.body.appendChild( elem );
					elem.click();
					document.body.removeChild( elem );
				}
			}
			term.focus();
		}
	}
};
</script>

<style>
body, html {
	font-family: helvetica, sans-serif, arial;
	font-size: 1em;
	color: #111;
	background-color: rgb(0, 0, 0);
	color: rgb(240, 240, 240);
	height: 100%;
	margin: 0;
}

#header {
	color: rgb(240, 240, 240);
	background-color: rgb(0, 128, 0);
	width: 100%;
	border-color: white;
	border-style: none none solid none;
	border-width: 1px;
	text-align: center;
	flex: 0 1 auto;
	z-index: 99;
	height: 19px;
	display: none;
}

.box {
	display: block;
	height: 100%;
}

#terminal-container {
	display: block;
	width: calc(100% - 1px);
	margin: 0 auto;
	padding: 2px;
	height: calc(100% - 19px);
}

#terminal-container .terminal {
	background-color: #000000;
	color: #fafafa;
	padding: 2px;
	height: calc(100% - 19px);
}

#terminal-container .terminal:focus .terminal-cursor {
	background-color: #fafafa;
}

#bottomdiv {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	background-color: rgb(50, 50, 50);
	border-color: white;
	border-style: solid none none none;
	border-width: 1px;
	z-index: 99;
	height: 19px;
}

#footer {
	display: inline-block;
	color: rgb(240, 240, 240);
	background-color: rgb(50, 50, 50);
	padding-left: 5px;
	padding-right: 5px;
	border-color: white;
	border-style: none none none solid;
	border-width: 1px;
	text-align: left;
}

#status {
	display: inline-block;
	color: rgb(240, 240, 240);
	background-color: rgb(50, 50, 50);
	padding-left: 10px;
	padding-right: 10px;
	border-color: white;
	border-style: none solid none solid;
	border-width: 1px;
	text-align: left;
	z-index: 100;
}

#countdown {
	display: none;
	color: rgb(240, 240, 240);
	background-color: rgb(50, 50, 50);
	padding-left: 10px;
	padding-right: 10px;
	border-color: white;
	border-style: none solid none solid;
	border-width: 1px;
	text-align: left;
	z-index: 100;
}

#countdown.active {
	display: inline-block;
	animation: countdown infinite alternate 200ms;
}

@keyframes countdown {
	from {
		background-color: rgb(255, 255, 0);
	}
	to {
		background-color: inherit;
	}
}

#menu {
	display: inline-block;
	font-size: 16px;
	color: rgb(255, 255, 255);
	padding-left: 10px;
	z-index: 100;
}

#menu:hover .dropup-content {
	display: block;
}

#logBtn, #credentialsBtn, #reauthBtn {
	color: #000;
}

.dropup {
	position: relative;
	display: inline-block;
	cursor: pointer;
}

.dropup-content {
	display: none;
	position: absolute;
	background-color: #f1f1f1;
	font-size: 16px;
	min-width: 160px;
	bottom: 18px;
	z-index: 101;
}

.dropup-content a {
	color: #777;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
}

.dropup-content a:hover {
	background-color: #ccc
}

.dropup:hover .dropup-content {
	display: block;
}

.dropup:click .dropup-content {
	display: block;
}

.dropup:hover .dropbtn {
	background-color: #3e8e41;
}

.xterm {
	font-feature-settings: "liga" 0;
	position: relative;
	user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
}

.xterm.focus,
.xterm:focus {
	outline: none;
}

.xterm .xterm-helpers {
	position: absolute;
	top: 0;
	/**
	 * The z-index of the helpers must be higher than the canvases in order for
	 * IMEs to appear on top.
	 */
	z-index: 5;
}

.xterm .xterm-helper-textarea {
	/*
	 * HACK: to fix IE's blinking cursor
	 * Move textarea out of the screen to the far left, so that the cursor is not visible.
	 */
	position: absolute;
	opacity: 0;
	left: -9999em;
	top: 0;
	width: 0;
	height: 0;
	z-index: -5;
	/** Prevent wrapping so the IME appears against the textarea at the correct position */
	white-space: nowrap;
	overflow: hidden;
	resize: none;
}

.xterm .composition-view {
	/* TODO: Composition position got messed up somewhere */
	background: #000;
	color: #FFF;
	display: none;
	position: absolute;
	white-space: nowrap;
	z-index: 1;
}

.xterm .composition-view.active {
	display: block;
}

.xterm .xterm-viewport {
	/* On OS X this is required in order for the scroll bar to appear fully opaque */
	background-color: #000;
	overflow-y: scroll;
	cursor: default;
	position: absolute;
	right: 0;
	left: 0;
	top: 0;
	bottom: 0;
}

.xterm .xterm-screen {
	position: relative;
}

.xterm .xterm-screen canvas {
	position: absolute;
	left: 0;
	top: 0;
}

.xterm .xterm-scroll-area {
	visibility: hidden;
}

.xterm-char-measure-element {
	display: inline-block;
	visibility: hidden;
	position: absolute;
	top: 0;
	left: -9999em;
	line-height: normal;
}

.xterm {
	cursor: text;
}

.xterm.enable-mouse-events {
	/* When mouse events are enabled (eg. tmux), revert to the standard pointer cursor */
	cursor: default;
}

.xterm.xterm-cursor-pointer {
	cursor: pointer;
}

.xterm.column-select.focus {
	/* Column selection mode */
	cursor: crosshair;
}

.xterm .xterm-accessibility,
.xterm .xterm-message {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	z-index: 10;
	color: transparent;
}

.xterm .live-region {
	position: absolute;
	left: -9999px;
	width: 1px;
	height: 1px;
	overflow: hidden;
}

.xterm-dim {
	opacity: 0.5;
}

.xterm-underline {
	text-decoration: underline;
}

body, html {
	font-family: helvetica, sans-serif, arial;
	font-size: 1em;
	color: #111;
	background-color: rgb(0, 0, 0);
	color: rgb(240, 240, 240);
	height: 100%;
	margin: 0;
}

#header {
	color: rgb(240, 240, 240);
	background-color: rgb(0, 128, 0);
	width: 100%;
	border-color: white;
	border-style: none none solid none;
	border-width: 1px;
	text-align: center;
	flex: 0 1 auto;
	z-index: 99;
	height: 19px;
	display: none;
}

.box {
	display: block;
	height: 100%;
}

#terminal-container {
	display: block;
	width: calc(100% - 1px);
	margin: 0 auto;
	padding: 2px;
	height: calc(100% - 19px);
}

#terminal-container .terminal {
	background-color: #000000;
	color: #fafafa;
	padding: 2px;
	height: calc(100% - 19px);
}

#terminal-container .terminal:focus .terminal-cursor {
	background-color: #fafafa;
}

#bottomdiv {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	background-color: rgb(50, 50, 50);
	border-color: white;
	border-style: solid none none none;
	border-width: 1px;
	z-index: 99;
	height: 19px;
}

#footer {
	display: inline-block;
	color: rgb(240, 240, 240);
	background-color: rgb(50, 50, 50);
	padding-left: 5px;
	padding-right: 5px;
	border-color: white;
	border-style: none none none solid;
	border-width: 1px;
	text-align: left;
}

#status {
	display: inline-block;
	color: rgb(240, 240, 240);
	background-color: rgb(50, 50, 50);
	padding-left: 10px;
	padding-right: 10px;
	border-color: white;
	border-style: none solid none solid;
	border-width: 1px;
	text-align: left;
	z-index: 100;
}

#countdown {
	display: none;
	color: rgb(240, 240, 240);
	background-color: rgb(50, 50, 50);
	padding-left: 10px;
	padding-right: 10px;
	border-color: white;
	border-style: none solid none solid;
	border-width: 1px;
	text-align: left;
	z-index: 100;
}

#countdown.active {
	display: inline-block;
	animation: countdown infinite alternate 200ms;
}

@keyframes countdown {
	from {
		background-color: rgb(255, 255, 0);
	}
	to {
		background-color: inherit;
	}
}

#menu {
	display: inline-block;
	font-size: 16px;
	color: rgb(255, 255, 255);
	padding-left: 10px;
	z-index: 100;
}

#menu:hover .dropup-content {
	display: block;
}

#logBtn, #credentialsBtn, #reauthBtn {
	color: #000;
}

.dropup {
	position: relative;
	display: inline-block;
	cursor: pointer;
}

.dropup-content {
	display: none;
	position: absolute;
	background-color: #f1f1f1;
	font-size: 16px;
	min-width: 160px;
	bottom: 18px;
	z-index: 101;
}

.dropup-content a {
	color: #777;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
}

.dropup-content a:hover {
	background-color: #ccc
}

.dropup:hover .dropup-content {
	display: block;
}

.dropup:click .dropup-content {
	display: block;
}

.dropup:hover .dropbtn {
	background-color: #3e8e41;
}
</style>
