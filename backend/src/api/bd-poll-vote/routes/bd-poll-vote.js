//@ts-nocheck
"use strict";

/**
 * bd-poll-vote router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::bd-poll-vote.bd-poll-vote", {
  config: {
    find: {
      roles: ["authenticated", "public"],
    },
    create: {
      roles: ["authenticated"],
    },
    findOne: {
      roles: [],
    },
    update: {
      roles: ["authenticated"],
      middlewares: ["global::is-owner"],
    },
    delete: {
      roles: ["authenticated"],
      middlewares: ["global::is-owner"],
    },
  },
});
