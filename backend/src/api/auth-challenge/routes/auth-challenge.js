'use strict';

/**
 * auth-challenge router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::auth-challenge.auth-challenge', {
	config: {
		find: {
			roles: ['authenticated', 'public'],
		},
		create: {
			roles: [],
		},
		findOne: {
			roles: ['authenticated', 'public'],
		},
		update: {
			roles: [],
		},
		delete: {
			roles: [],
		},
	},
});
