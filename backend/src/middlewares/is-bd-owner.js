'use strict';

module.exports = (config, { strapi }) => {
	return async (ctx, next) => {
		const entryId = ctx.params.id;
		const user = ctx.state.user;
		const userId = user?.id;

		if (!userId) return ctx.unauthorized(`You can't access this entry`);

		const apiName = ctx.state.route.info.apiName;
		const apiMethod = ctx?.request?.method;

		function generateUID(apiName) {
			const apiUid = `api::${apiName}.${apiName}`;
			return apiUid;
		}

		const appUid = generateUID(apiName);

		if (entryId) {
			const entry = await strapi.entityService.findOne(appUid, entryId, {
				populate: ['creator'],
			});

			if (entry && entry?.creator?.id?.toString() !== userId?.toString())
				return ctx.unauthorized(
					`You can't ${apiMethod?.toLowerCase()} this proposal.`
				);
		}

		if (!entryId) {
			ctx.query = {
				...ctx.query,
				filters: { ...ctx.query.filters, creator: `${userId}` },
			};
		}

		await next();
	};
};
