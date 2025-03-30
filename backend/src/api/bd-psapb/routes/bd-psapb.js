"use strict";

/**
 * bd-psapb router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::bd-psapb.bd-psapb", {
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
});
