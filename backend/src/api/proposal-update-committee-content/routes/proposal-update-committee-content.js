'use strict';

/**
 * proposal-update-committee-content router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::proposal-update-committee-content.proposal-update-committee-content', {
  config: {
    find: {
      roles: ["authenticated", "public"],
    },
    create: {
      roles: ["authenticated"],
    },
    findOne: {
      roles: ["authenticated", "public"],
    },
    update: {
      roles: ["authenticated"],
      middlewares: ["global::is-owner"],
    },
    delete: {
      roles: [],
    },
  },
});
