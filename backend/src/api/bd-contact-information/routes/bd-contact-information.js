'use strict';

/**
 * bd-contact-information router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bd-contact-information.bd-contact-information', {
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
