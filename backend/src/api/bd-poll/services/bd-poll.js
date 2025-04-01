'use strict';

/**
 * bd-poll service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bd-poll.bd-poll');
