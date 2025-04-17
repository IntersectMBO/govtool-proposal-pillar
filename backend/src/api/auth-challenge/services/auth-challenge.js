'use strict';

/**
 * auth-challenge service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::auth-challenge.auth-challenge');
