"use strict";

/**
 * bd controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

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

      const mainEntryData = {
        privacy_policy: data.privacy_policy,
        intersect_named_administrator:
          data.intersect_named_administrator || false,
        old_ver: data.old_ver,
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

      if (data?.old_ver) {
        await strapi.entityService.update("api::bd.bd", data.old_ver, {
          data: { is_active: false },
        });
        const poll = await strapi.entityService.findMany(
          "api::bd-poll.bd-poll",
          { filters: { bd_proposal_id: data.old_ver } }
        );
        if (poll.length > 0) {
          await strapi.entityService.update(
            "api::bd-poll.bd-poll",
            poll[0].id,
            { data: { bd_proposal_id: createdEntry.id.toString() } }
          );
        }
        const comments = await strapi.entityService.findMany(
          "api::comment.comment",
          { filters: { bd_proposal_id: data.old_ver } }
        );
        if (comments.length > 0) {
          for (const comment of comments) {
            await strapi.entityService.update(
              "api::comment.comment",
              comment.id,
              { data: { bd_proposal_id: createdEntry.id.toString() } }
            );
          }
        }
      } else {
        await strapi.entityService.create("api::bd-poll.bd-poll", {
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
}));
