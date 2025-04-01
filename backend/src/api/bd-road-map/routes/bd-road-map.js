"use strict";

/**
 * bd-road-map router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::bd-road-map.bd-road-map", {
  config: {
    find: {
      roles: ["authenticated", "public"],
    },
    findOne: {
      roles: ["authenticated", "public"],
    },
  },
});
