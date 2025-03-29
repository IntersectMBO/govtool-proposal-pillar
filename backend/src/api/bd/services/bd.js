'use strict';

/**
 * bd service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bd.bd');
