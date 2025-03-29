'use strict';

/**
 * bd-psapb router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bd-psapb.bd-psapb', {
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

