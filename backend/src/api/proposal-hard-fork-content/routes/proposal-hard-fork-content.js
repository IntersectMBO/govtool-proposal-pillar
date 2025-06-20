'use strict';

/**
 * proposal-hard-fork-content router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::proposal-hard-fork-content.proposal-hard-fork-content', {
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
