'use strict';

/**
 * budget-discussion-contract-type router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::budget-discussion-contract-type.budget-discussion-contract-type', {
    config: {
      find: {
        roles: ["authenticated", "public"],
      },
      create: {
        roles: [],
      },
      findOne: {
        roles: ["authenticated", "public"],
      },
      update: {
        roles: [],
      },
      delete: {
        roles: [],
      },
    },
  });
  