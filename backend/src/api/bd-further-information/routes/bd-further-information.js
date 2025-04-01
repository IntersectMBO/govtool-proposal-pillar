"use strict";

/**
 * bd-further-information router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::bd-further-information.bd-further-information",
  {
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
  }
);
