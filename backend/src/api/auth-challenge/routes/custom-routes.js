module.exports = {
	routes: [
		{
			method: 'GET',
			path: '/auth/challenge',
			handler: 'auth-challenge.getChallenge',
			config: {
				roles: ['authenticated', 'public'],
			},
		},
	],
};
