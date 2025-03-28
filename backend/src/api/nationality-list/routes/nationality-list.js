'use strict';

/**
 * nationality-list router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::nationality-list.nationality-list', {
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