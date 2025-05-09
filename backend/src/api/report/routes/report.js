module.exports = {
	routes: [
	  {
		method: 'GET',
		path: '/report/generateSnapShootReport',
		handler: 'report.generateSnapShootReport',
		// path: '/reports/getBdSnapshot',
		// handler: 'report.getBdSnapshot',
		config: {
			roles: ['authenticated', 'public'],
		},
	  },
	],
  };