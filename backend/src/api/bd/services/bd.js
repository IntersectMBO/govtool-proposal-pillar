"use strict";

/**
 * bd service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::bd.bd", ({ strapi }) => ({
  async findOne(entityId, params = {}) {
    let current = await strapi.entityService.findOne(
      "api::bd.bd",
      entityId,
      params
    );

    if (!current) {
      return null;
    }

    while (true) {
      const nextRecords = await strapi.entityService.findMany("api::bd.bd", {
        ...params,
        filters: {
          ...(params.filters || {}),
          old_ver: current.id,
        },
        limit: 1,
      });

      if (!nextRecords || nextRecords.length === 0) {
        break;
      }
      current = nextRecords[0];
    }

    return current;
  },
}));
