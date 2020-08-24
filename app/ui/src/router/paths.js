export default [
	{
		path: '/',
		name: 'home',
		view: 'Home',
		meta: {}
	},
	{
		path: '/info',
		name: 'info',
		view: 'Info',
		meta: {}
	},
	{
		path: '/ssh/:hostname',
		name: 'ssh',
		view: 'Ssh',
		meta: {}
	},
	{
		path: '/ssh/:hostname/:port(\\d+)',
		name: 'ssh',
		view: 'Ssh',
		meta: {}
	}
];
