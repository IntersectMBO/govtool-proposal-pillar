"use strict";

/**
 * bd controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

async function getLastOldVersion(oldVerId) {
  let currentId = oldVerId;
  let chainContinues = true;
  while (chainContinues) {
    const entries = await strapi.entityService.findMany("api::bd.bd", {
      filters: {
        old_ver: currentId,
      },
      populate: ["old_ver"],
    });
    if (entries?.length > 0) {
      const entry = entries[0];
      if (entry && entry?.id) {
        currentId = entry?.id;
      } else {
        chainContinues = false;
      }
    } else {
      chainContinues = false;
    }
  }
  return currentId;
}

module.exports = createCoreController("api::bd.bd", ({ strapi }) => ({
  async create(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized("Unknown user");

      const { data } = ctx.request.body;
      if (!data.privacy_policy) {
        return ctx.badRequest("Privacy policy must be accepted");
      }

      const savedEntities = {};

      // BD-PSAPB
      if (data.bd_psapb) {
        savedEntities.bd_psapb = await strapi.entityService.create(
          "api::bd-psapb.bd-psapb",
          {
            data: data.bd_psapb,
          }
        );
      }

      // BD-Costing
      if (data.bd_costing) {
        savedEntities.bd_costing = await strapi.entityService.create(
          "api::bd-costing.bd-costing",
          {
            data: data.bd_costing,
          }
        );
      }

      // BD-Proposal-Details
      if (data.bd_proposal_detail) {
        savedEntities.bd_proposal_detail = await strapi.entityService.create(
          "api::bd-proposal-detail.bd-proposal-detail",
          {
            data: data.bd_proposal_detail,
          }
        );
      }

      // BD-Proposal-Ownership
      if (data.bd_proposal_ownership) {
        savedEntities.bd_proposal_ownership = await strapi.entityService.create(
          "api::bd-proposal-ownership.bd-proposal-ownership",
          {
            data: data.bd_proposal_ownership,
          }
        );
      }

      // BD-Contact-Information
      if (data.bd_contact_information) {
        savedEntities.bd_contact_information =
          await strapi.entityService.create(
            "api::bd-contact-information.bd-contact-information",
            {
              data: data.bd_contact_information,
            }
          );
      }

      //BD-Further-Information
      if (data.bd_further_information) {
        const furtherInfoData = { ...data.bd_further_information };
        if (furtherInfoData.proposal_links) {
          savedEntities.bd_further_information =
            await strapi.entityService.create(
              "api::bd-further-information.bd-further-information",
              {
                data: furtherInfoData,
              }
            );
        }
      }

      let latestVersionId = null;

      if (data?.old_ver) {
        // find me this bd and check if is_active, if no - find bd where that old_ver is placed as old_ver in some other bd, and if that is not active, find a bd where parent id is old_ver and recursively get  to the version where that is the latest version of that bd
        latestVersionId = await getLastOldVersion(data?.old_ver);
      }

      const mainEntryData = {
        privacy_policy: data.privacy_policy,
        intersect_named_administrator:
          data.intersect_named_administrator || false,
        intersect_admin_further_text: data.intersect_admin_further_text || null,
        old_ver: latestVersionId || null,
        creator: user.id,
        bd_psapb: savedEntities.bd_psapb?.id || null,
        bd_costing: savedEntities.bd_costing?.id || null,
        bd_proposal_detail: savedEntities.bd_proposal_detail?.id || null,
        bd_proposal_ownership: savedEntities.bd_proposal_ownership?.id || null,
        bd_contact_information:
          savedEntities.bd_contact_information?.id || null,
        bd_further_information:
          savedEntities.bd_further_information?.id || null,
      };

      const createdEntry = await strapi.entityService.create("api::bd.bd", {
        data: mainEntryData,
        populate: {
          bd_psapb: true,
          bd_costing: true,
          bd_proposal_detail: true,
          bd_proposal_ownership: true,
          bd_contact_information: true,
          bd_further_information: {
            populate: ["proposal_links"],
          },
          creator: true,
        },
      });

      if (latestVersionId) {
			await strapi.entityService.update('api::bd.bd', latestVersionId, {
				data: { is_active: false },
			});

			const latestVersionProposalData =
				await strapi.entityService.findOne(
					'api::bd.bd',
					latestVersionId
				);
			await strapi.entityService.update('api::bd.bd', createdEntry?.id, {
				data: {
					prop_comments_number:
						latestVersionProposalData?.prop_comments_number || 0,
				},
			});

			const poll = await strapi.entityService.findMany(
				'api::bd-poll.bd-poll',
				{ filters: { bd_proposal_id: latestVersionId } }
			);
			if (poll.length > 0) {
				await strapi.entityService.update(
					'api::bd-poll.bd-poll',
					poll[0].id,
					{ data: { bd_proposal_id: createdEntry.id.toString() } }
				);
			}
			const comments = await strapi.entityService.findMany(
				'api::comment.comment',
				{ filters: { bd_proposal_id: latestVersionId } }
			);
			if (comments.length > 0) {
				for (const comment of comments) {
					await strapi.entityService.update(
						'api::comment.comment',
						comment.id,
						{
							data: {
								bd_proposal_id: createdEntry.id.toString(),
							},
						}
					);
				}
			}
		} else {
			await strapi.entityService.create('api::bd-poll.bd-poll', {
				data: { bd_proposal_id: createdEntry.id.toString() },
			});
		}

      return createdEntry;
    } catch (error) {
      console.log(error);
      strapi.log.error("FULL CREATE ERROR:", {
        message: error.message,
        stack: error.stack,
        request: ctx.request.body,
      });
      return ctx.internalServerError(
        "There was an error when saving the entire BD entry"
      );
    }
  },
  async bdProposalVersions(ctx) {
    const { id } = ctx.params;
    if (!id) {
      return ctx.badRequest("ID is required");
    }

    const populate = [
      "creator",
      "old_ver",
      "bd_costing.preferred_currency",
      "bd_proposal_detail.contract_type_name",
      "bd_further_information.proposal_links",
      "bd_psapb.type_name",
      "bd_psapb.roadmap_name",
      "bd_psapb.committee_name",
      "bd_proposal_ownership.be_country",
    ];
    let current = await strapi.entityService.findOne("api::bd.bd", id, {
      populate: populate,
    });
    if (!current) {
      return ctx.notFound("Resource not found");
    }

    const versions = [current];

    while (current && current.old_ver) {
      const previous = await strapi.entityService.findOne(
        "api::bd.bd",
        current?.old_ver?.id,
        {
          populate: populate,
        }
      );

      if (!previous) break;
      versions.push(previous);
      current = previous;
    }

    return this.transformResponse(versions);
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    const query = ctx.request.query;

    const entity = await strapi.service("api::bd.bd").findOne(id, query);

    const entitiCreator = await strapi.entityService.findOne("api::bd.bd", id, {
      populate: ["creator"],
    });

    if (
      entity?.bd_contact_information &&
      user?.id !== entitiCreator?.creator?.id
    ) {
      delete entity.bd_contact_information;
    }

    if (entity?.creator) {
      delete entity?.creator?.username;
      delete entity?.creator?.email;
      delete entity?.creator?.provider;
      delete entity?.creator?.blocked;
      delete entity?.creator?.createdAt;
      delete entity?.creator?.updatedAt;
      delete entity?.creator?.is_validated;
      delete entity?.creator?.password;
      delete entity?.creator?.confirmed;
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async find(ctx) {
    const query = ctx.request.query;

    const { results, pagination } = await strapi.service("api::bd.bd").find({
      ...query,
    });

    const sanitizedResults = results.map((entity) => {
      if (entity?.bd_contact_information) {
        delete entity.bd_contact_information;
      }

      if (entity?.creator) {
        delete entity?.creator?.username;
        delete entity?.creator?.email;
        delete entity?.creator?.provider;
        delete entity?.creator?.blocked;
        delete entity?.creator?.createdAt;
        delete entity?.creator?.updatedAt;
        delete entity?.creator?.is_validated;
        delete entity?.creator?.password;
        delete entity?.creator?.confirmed;
      }
      return entity;
    });

    const sanitizedOutput = await this.sanitizeOutput(sanitizedResults, ctx);
    return this.transformResponse(sanitizedOutput, { pagination });
  },
}));
