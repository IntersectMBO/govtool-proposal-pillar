"use strict";

/**
 * bd-proposal-ownership router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::bd-proposal-ownership.bd-proposal-ownership",
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
