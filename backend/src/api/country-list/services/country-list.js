'use strict';

/**
 * country-list service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::country-list.country-list');
