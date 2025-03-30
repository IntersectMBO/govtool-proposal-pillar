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
      if (data.bd_proposal_details) {
        savedEntities.bd_proposal_details = await strapi.entityService.create(
          "api::bd-proposal-detail.bd-proposal-detail",
          {
            data: data.bd_proposal_details,
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
        itersect_named_administrator:
          data.itersect_named_administrator || false,
        creator: user.id,
        bd_psapb: savedEntities.bd_psapb?.id || null,
        bd_costing: savedEntities.bd_costing?.id || null,
        bd_proposal_details: savedEntities.bd_proposal_details?.id || null,
        bd_proposal_ownership: savedEntities.bd_proposal_ownership?.id || null,
        bd_contact_information:
          savedEntities.bd_contact_information?.id || null,
        bd_further_information: savedEntities.bd_further_information || null,
      };

      const createdEntry = await strapi.entityService.create("api::bd.bd", {
        data: mainEntryData,
        populate: {
          bd_psapb: true,
          bd_costing: true,
          bd_proposal_details: true,
          bd_proposal_ownership: true,
          bd_contact_information: true,
          bd_further_information: {
            populate: ["proposal_links"],
          },
          creator: true,
        },
      });

      return createdEntry;
    } catch (error) {
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
}));
