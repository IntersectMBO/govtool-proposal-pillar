// @ts-nocheck
'use strict';

/**
 * poll controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::poll.poll', ({ strapi }) => ({
	async create(ctx) {
		try {
		const { data } = ctx?.request?.body;
		const user = ctx?.state?.user;
		const proposal = await strapi.entityService.findOne("api::proposal.proposal",data.proposal_id);
		if(user.id.toString() !== proposal.user_id.toString())
		{
			return ctx.badRequest(null, 'User is not owner of this proposal');
		}
		const currentActivePool = await strapi.entityService.findMany("api::poll.poll",{filters:{$and:[{proposal_id:data.proposal_id},{is_poll_active:true}]},limit:1});
		if(currentActivePool.length > 0)
		{
			return ctx.badRequest(null, 'There is already an active pool for this proposal');
		}
		const newPool = await strapi.entityService.create("api::poll.poll",{data:data});
		return this.transformResponse(newPool);
		}
		catch (error) {
			console.error(error);
			ctx.status = 500;
			ctx.body = { error: error, message: error.message };
		}
	},



	async update(ctx) {
		const { id } = ctx.params;
		const { data } = ctx?.request?.body;
		const { is_poll_active: isPollActive } = data;

		const user = ctx?.state?.user;

		if (!user) {
			return ctx.badRequest(null, 'User is required');
		}

		let poll;
		let updatedPoll;
		let proposal;

		try {
			poll = await strapi.entityService.findOne('api::poll.poll', id);

			if (!poll) {
				return ctx.badRequest(null, 'Poll not found');
			}

			try {
				proposal = await strapi.entityService.findOne(
					'api::proposal.proposal',
					poll?.proposal_id
				);
				if (!proposal) {
					return ctx.badRequest(null, 'Proposal not found');
				}
			} catch (error) {
				return ctx.badRequest(null, 'Proposal not found');
			}

			if (proposal?.user_id?.toString() !== user?.id?.toString()) {
				return ctx.badRequest(
					null,
					'User is not authorized to update this Poll.'
				);
			}

			try {
				updatedPoll = await strapi.entityService.update(
					'api::poll.poll',
					id,
					{ data: { is_poll_active: isPollActive } }
				);

				if (!updatedPoll) {
					return ctx.badRequest(null, 'Poll not updated');
				}
			} catch {
				return ctx.badRequest(null, 'Poll not updated');
			}
			return this.transformResponse(updatedPoll);
		} catch (error) {
			ctx.status = 500;
			ctx.body = { error: error, message: error.message };
		}
	},
}));
