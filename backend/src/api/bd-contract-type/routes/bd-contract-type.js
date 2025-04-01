"use strict";

/**
 * bd-contract-type router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::bd-contract-type.bd-contract-type", {
  config: {
    find: {
      roles: ["authenticated", "public"],
    },
    findOne: {
      roles: ["authenticated", "public"],
    },
  },
});
