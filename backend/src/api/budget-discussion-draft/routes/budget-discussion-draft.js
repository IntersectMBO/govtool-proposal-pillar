'use strict';

/**
 * budget-discussion-draft router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::budget-discussion-draft.budget-discussion-draft', {
  config: {
    find: {
      roles: ["authenticated","public"],
    },
    create: {
      roles: ["authenticated","public"],
    },
    findOne: {
      roles: ["authenticated","public"],
    },
    update: {
      roles: ["authenticated","public"],
    },
    delete: {
      roles: ["authenticated","public"],
    },
  },
});
