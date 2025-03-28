'use strict';

/**
 * budget-discussion-type router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::budget-discussion-type.budget-discussion-type', {
	config: {
		find: {
			roles: ["authenticated", "public"],
		},
		create: {
			roles: [],
		},
		findOne: {
			roles: [],
		},
		update: {
			roles: [],
		},
		delete: {
			roles: [],
		},
	},
})
