'use strict';

/**
 * bd router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bd.bd', {
    config: {
      find: {
        roles: ["authenticated"],
      },
      create: {
        roles: ["authenticated"],
      },
      findOne: { 
        roles: ["authenticated"],
      },
      update: {
        roles: ["authenticated"],
      }, 
      delete: {
        roles: ["authenticated"],
      },
    },
  });
