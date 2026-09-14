'use strict';

/**
 * auth-challenge router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::auth-challenge.auth-challenge', {
	config: {
		find: {
			roles: ['authenticated'],
		},
		create: {
			roles: [],
		},
		findOne: {
			roles: ['authenticated'],
		},
		update: {
			roles: [],
		},
		delete: {
			roles: [],
		},
	},
});
