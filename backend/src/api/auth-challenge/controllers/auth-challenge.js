'use strict';

const crypto = require('crypto');

/**
 * auth-challenge controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
	'api::auth-challenge.auth-challenge',
	({ strapi }) => ({
		async getChallenge(ctx) {
			const { identifier } = ctx.query;
			if (!identifier) {
				return ctx.badRequest('Missing identifier');
			}

			const nonce = crypto.randomBytes(16).toString('hex');
			const timestamp = Date.now();
			const expiresAt = timestamp + 5 * 60 * 1000;

			const message = `To proceed, please sign this data to verify your identity. This ensures that the action is secure and confirms your identity.\nNonce: ${nonce}\nTimestamp: ${timestamp}`;

			await strapi.db.query('api::auth-challenge.auth-challenge').create({
				data: {
					identifier,
					nonce,
					message,
					timestamp: new Date(timestamp).toISOString(),
					expiresAt: new Date(expiresAt).toISOString(),
				},
			});

			return ctx.send({ message });
		},
	})
);
