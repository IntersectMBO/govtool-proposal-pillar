'use strict';

/**
 * bd-type router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bd-type.bd-type', {
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
