module.exports = {
	routes: [
		{
			method: 'POST',
			path: '/migration/country-lists',
			handler: 'migration.migrateCountries',
		},
		{
			method: 'POST',
			path: '/migration/currency-lists',
			handler: 'migration.migrateCurrencies',
		},
		{
			method: 'POST',
			path: '/migration/contract-types',
			handler: 'migration.migrateContractTypes',
		},
		{
			method: 'POST',
			path: '/migration/road-maps',
			handler: 'migration.migrateRoadMap',
		},
		{
			method: 'POST',
			path: '/migration/bd-types',
			handler: 'migration.migrateBdTypes',
		},
		{
			method: 'POST',
			path: '/migration/bd-intersect-committees',
			handler: 'migration.migrateBdIntersectCommittees',
		},
		{
			method: 'POST',
			path: '/migration/submissions',
			handler: 'migration.migrateSubmissions',
		},
	],
};
