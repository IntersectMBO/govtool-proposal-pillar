"use strict";

/**
 * bd service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::bd.bd", ({ strapi }) => ({
  async findOne(entityId, params = {}) {
    const records = await strapi.entityService.findMany("api::bd.bd", {
      ...params,
      filters: {
        ...(params.filters || {}),
        master_id: entityId,
        is_active: true,
      },
      limit: 1,
      sort: "createdAt:desc",
    });
    if (records?.length === 0) {
      return null;
    }
    return records[0];
  },
}));
