'use strict';

/**
 * bd-currency-list router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bd-currency-list.bd-currency-list', {
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
