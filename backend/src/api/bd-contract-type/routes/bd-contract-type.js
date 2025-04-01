'use strict';

/**
 * bd-contract-type router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bd-contract-type.bd-contract-type', {
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
