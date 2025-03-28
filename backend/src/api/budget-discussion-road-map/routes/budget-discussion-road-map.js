'use strict';

/**
 * budget-discussion-road-map router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::budget-discussion-road-map.budget-discussion-road-map', {
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
  
