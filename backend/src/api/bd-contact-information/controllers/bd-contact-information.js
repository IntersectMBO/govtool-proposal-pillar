"use strict";

/**
 * bd-contact-information controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::bd-contact-information.bd-contact-information",

  ({ strapi }) => ({
    async findOne(ctx) {
      return {};
    },

    async find(ctx) {
      return {};
    },
  })
);
