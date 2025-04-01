'use strict';

/**
 * comments-report router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::comments-report.comments-report', {
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
      },
      delete: {
        roles: ["authenticated"],
      },
    },
  });