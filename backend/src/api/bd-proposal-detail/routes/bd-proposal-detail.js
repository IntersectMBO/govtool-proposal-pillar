'use strict';

/**
 * bd-proposal-detail router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bd-proposal-detail.bd-proposal-detail', {
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

