'use strict';

/**
 * budget-discussion-intersect-committee router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::budget-discussion-intersect-committee.budget-discussion-intersect-committee', {
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
  
