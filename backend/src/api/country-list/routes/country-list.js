"use strict";

/**
 * country-list router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::country-list.country-list", {
  config: {
    find: {
      roles: ["authenticated", "public"],
    },
    findOne: {
      roles: ["authenticated", "public"],
    },
  },
});
