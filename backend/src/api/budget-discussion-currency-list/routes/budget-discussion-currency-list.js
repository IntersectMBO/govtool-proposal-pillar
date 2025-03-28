'use strict';

/**
 * budget-discussion-currency-list router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::budget-discussion-currency-list.budget-discussion-currency-list', {
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
  