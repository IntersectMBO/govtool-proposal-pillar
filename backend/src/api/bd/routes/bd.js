'use strict';

/**
 * bd router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bd.bd', {
	config: {
		find: {
			roles: ['authenticated', 'public'],
		},
		create: {
			roles: ['authenticated'],
		},
		findOne: {
			roles: ['authenticated', 'public'],
		},
		update: {
			roles: ['authenticated'],
		},
		delete: {
			roles: ['authenticated'],
			middlewares: ['global::is-bd-owner'],
		},
	},
});
