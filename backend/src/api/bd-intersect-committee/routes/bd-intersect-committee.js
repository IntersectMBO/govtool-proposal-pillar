"use strict";

/**
 * bd-intersect-committee router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::bd-intersect-committee.bd-intersect-committee",
  {
    config: {
      find: {
        roles: ["authenticated", "public"],
      },
      findOne: {
        roles: ["authenticated", "public"],
      },
    },
  }
);
