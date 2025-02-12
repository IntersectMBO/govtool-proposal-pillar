// @ts-nocheck
"use strict";

/**
 * proposal controller
 */
const {Address,RewardAddress} = require("@emurgo/cardano-serialization-lib-nodejs");


const { createCoreController } = require("@strapi/strapi").factories;
async function isRewardAddress(address) {
  try {
    const stake = RewardAddress.from_address(Address.from_bech32(address));
    return stake ? true : false;
  } catch (e) {
    return false;
  }
}
module.exports = createCoreController(
  "api::proposal.proposal",
  ({ strapi }) => ({
    async find(ctx) {
      
      const sanitizedQueryParams = ctx.query;
      if (!sanitizedQueryParams.filters) {
        sanitizedQueryParams.filters = {};
      }

      if (!sanitizedQueryParams.filters["$and"]) {
        sanitizedQueryParams.filters["$and"] = [];
      }

      /////GOV ACTION TYPE///////////
      
      const hasGovActionTypeIDFilter = sanitizedQueryParams.filters["$and"]?.find(
        (elem) => elem?.hasOwnProperty("gov_action_type_id")
      );
      
      if (hasGovActionTypeIDFilter) {
        const hasGovActionTypeIDFilterInSanitize =
          sanitizedQueryParams?.filters["$and"]?.some((elem) =>
            elem?.hasOwnProperty("gov_action_type_id")
          );
        if (!hasGovActionTypeIDFilterInSanitize) {
          sanitizedQueryParams.filters["$and"].push({
            gov_action_type_id: hasGovActionTypeIDFilter?.gov_action_type_id,
          });
        }
      }
      //////////////////////////
      /////PROPOSAL NAME///////////
      const hasPropNameFilter = ctx?.query?.filters["$and"]?.find((elem) =>
        elem?.hasOwnProperty("prop_name")
      );

      if (hasPropNameFilter) {
        const hasPropNameFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"
        ]?.some((elem) => elem?.hasOwnProperty("prop_name"));
        if (!hasPropNameFilterInSanitize) {
          sanitizedQueryParams.filters["$and"].push({
            prop_name: hasPropNameFilter?.prop_name,
          });
        }
      }
      //////////////////////////////
      /////PROPOSAL SUBMITTED///////////
      const hasPropSubmitedFilter = ctx?.query?.filters["$and"]?.find((elem) =>
        elem?.hasOwnProperty("prop_submitted")
      );

      if (hasPropSubmitedFilter) {
        const hasPropSubmitedFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"
        ]?.some((elem) => elem?.hasOwnProperty("prop_submitted"));
        if (!hasPropSubmitedFilterInSanitize) {
          if (hasPropSubmitedFilter?.prop_submitted === "true") {
            sanitizedQueryParams.filters["$and"].push({
              prop_submitted: hasPropSubmitedFilter?.prop_submitted,
            });
          } else {
            sanitizedQueryParams.filters["$and"].push({
              $or: [
                {
                  prop_submitted: false,
                },
                {
                  prop_submitted: {
                    $null: true,
                  },
                },
              ],
            });
          }
        }
      }
      //////////////////////////////
      /////PROPOSAL ID///////////
      const hasPropIdFilter = ctx?.query?.filters["$and"]?.find((elem) =>
        elem?.hasOwnProperty("prop_id")
      );
   
      if (hasPropIdFilter) {
        if (!ctx?.state?.user) {
          return ctx.badRequest(null, "User is required");
        }

        const hasPropIdFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"          
        ]?.some((elem) => elem?.hasOwnProperty("prop_id"));  
        
        if (hasPropIdFilterInSanitize) {
          sanitizedQueryParams.filters["$and"].push({
            proposal_id: hasPropIdFilter?.prop_id,
            user_id: ctx?.state?.user?.id,
          });
        }
      } else {
        sanitizedQueryParams.filters["$and"].push({
          prop_rev_active: true,
        });
      }
      //////////////////////////////
      /////IS DRAFT///////////
      const hasIsDraftFilter = ctx?.query?.filters["$and"]?.find((elem) =>
        elem?.hasOwnProperty("is_draft")
      );
      if (hasIsDraftFilter) {
         if (!ctx?.state?.user) {
           return ctx.badRequest(null, "User is required");
         }
        const hasIsDraftFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"
        ]?.some((elem) => elem?.hasOwnProperty("is_draft"));
        if (!hasIsDraftFilterInSanitize) {
          sanitizedQueryParams.filters["$and"].push({
            is_draft: hasIsDraftFilter?.is_draft,
            user_id: ctx?.state?.user?.id,
          });
        }
        const hasUserFilterInSanitize = sanitizedQueryParams?.filters[
          "$and"
        ]?.some((elem) => elem?.hasOwnProperty("user_id"));
        if(!hasUserFilterInSanitize){
          sanitizedQueryParams.filters["$and"].push({
            user_id: ctx?.state?.user?.id,
          })
        };
      } else {
        sanitizedQueryParams.filters["$and"].push({
          is_draft: false,
        });
      }
      //////////////////////////////

      let proposalsList = [];

      const { results, pagination } = await strapi
        .controller("api::proposal-content.proposal-content")
        .find(sanitizedQueryParams);

      for (const proposalContent of results) {
        const proposal = await strapi.entityService.findOne(
          "api::proposal.proposal",
          proposalContent?.proposal_id
        );

        const proposalUser = await strapi
          .query("plugin::users-permissions.user")
          .findOne({ where: { id: +proposal?.user_id } });

        if (proposalUser?.govtool_username) {
          proposal.user_govtool_username = proposalUser?.govtool_username;
        } else {
          proposal.user_govtool_username = "Anonymous";
        }

        const transformedProposalContent =
          this.transformResponse(proposalContent);
        proposal.content = transformedProposalContent?.data;
        proposalsList.push(proposal);
      }
      return this.transformResponse(proposalsList, { pagination });
    },
    async findOne(ctx) {
		const { id } = ctx?.params;

		if (!id) {
			return ctx.badRequest(null, 'Proposal ID is required');
		}
		// const sanitizedQueryParams = await this.sanitizeQuery(ctx);

		const proposal = await strapi.entityService.findOne(
			'api::proposal.proposal',
			id
		);

		if (!proposal) {
			return ctx.badRequest(null, 'Proposal not found');
		}

		const proposalContent = await strapi
			.controller('api::proposal-content.proposal-content')
			.find({
				query: {
					filters: {
						proposal_id: proposal.id,
						prop_rev_active: true,
					},
				},
			});

		if (proposalContent?.data?.length > 0) {
			if (proposalContent?.data?.[0]?.attributes?.is_draft) {
				return ctx.badRequest(
					null,
					'You can not access draft proposal details.'
				);
			}
			proposal.content = proposalContent?.data?.[0];
		} else {
			proposal.content = null;
		}

		const proposalUser = await strapi
			.query('plugin::users-permissions.user')
			.findOne({ where: { id: +proposal?.user_id } });

		if (proposalUser?.govtool_username) {
			proposal.user_govtool_username = proposalUser?.govtool_username;
		} else {
			proposal.user_govtool_username = 'Anonymous';
		}

		return this.transformResponse(proposal);
	},
    async create(ctx) {
      const { data } = ctx?.request?.body;
      const user = ctx?.state?.user;
      const gov_action_type_id  = data?.gov_action_type_id?.toString();
      if (!user) {
        return ctx.badRequest(null, "User is required");
      }

      let proposal;
      let proposal_content;
      // Delete the Prposal
      const deleteProposal = async () => {
        let deletedProposal = await strapi.entityService.delete(
          "api::proposal.proposal",
          proposal?.id
        );

        if (!deletedProposal) {
          return ctx.badRequest(null, "Proposal not deleted");
        }
      };

      // Delete the Proposal Content
      const deleteProposalContent = async () => {
        let deletedProposal = await strapi.entityService.delete(
          "api::proposal-content.proposal-content",
          proposal_content?.id
        );

        if (!deletedProposal) {
          return ctx.badRequest(null, "Proposal content not deleted");
        }
      };
      
      try {
        // chek if treasuiry action have adress and amount
        const gaTypes = await strapi.entityService.findOne("api::governance-action-type.governance-action-type",data?.gov_action_type_id)
        // 2. Treasuty
        if(gov_action_type_id == 2)
        {
            // check if withdrawal parameters exist
            if (data?.proposal_withdrawals?.length === 0) {
              return ctx.badRequest(null, "Withdrawal parametars not exist");
            }
            // Check if data is invalid
            const isInvalid = await Promise.all(data.proposal_withdrawals.map(async (item) => {
              return !(await isRewardAddress(item.prop_receiving_address)) || !item.prop_amount || item.prop_amount <= 0;
            })).then(results => results.some(result => result));
            if(isInvalid)
              return ctx.badRequest(null, "Withdrawal addrress or amount parametars not valid");
        }
        // 3. Constitution
        if (gov_action_type_id == 3) {
          const { proposal_constitution_content } = data;
          // Check if proposal_constitution_content exists
          if (!proposal_constitution_content) {
              return ctx.badRequest(null, "proposal_constitution_content is required for Constitution action");
          }
          // Validate prop_constitution_url (required and must be a valid URL)
          const isValidUrl = (url) => {
              try {
                  new URL(url); // Check if the URL is valid
                  return true;
              } catch (e) {
                  return false;
              }
          };
          if (!proposal_constitution_content.prop_constitution_url || !isValidUrl(proposal_constitution_content.prop_constitution_url)) {
              return ctx.badRequest(null, "prop_constitution_url is required and must be a valid URL (IPFS is allowed)");
          }
          // Validate prop_have_guardrails_script
          if (proposal_constitution_content.prop_have_guardrails_script === true) {
              // If true, check if prop_guardrails_script_url and prop_guardrails_script_hash exist
              if (!proposal_constitution_content.prop_guardrails_script_url || !isValidUrl(proposal_constitution_content.prop_guardrails_script_url)) {
                  return ctx.badRequest(null, "prop_guardrails_script_url is required and must be a valid URL when prop_have_guardrails_script is true");
              }
              if (!proposal_constitution_content.prop_guardrails_script_hash) {
                  return ctx.badRequest(null, "prop_guardrails_script_hash is required when prop_have_guardrails_script is true");
              }
          } else if (proposal_constitution_content.prop_have_guardrails_script === false || proposal_constitution_content.prop_have_guardrails_script === null) {
              // If false or null, check if prop_guardrails_script_url and prop_guardrails_script_hash are absent
              if (proposal_constitution_content.prop_guardrails_script_url || proposal_constitution_content.prop_guardrails_script_hash) {
                  return ctx.badRequest(null, "prop_guardrails_script_url and prop_guardrails_script_hash must not be provided when prop_have_guardrails_script is false or null");
              }
          } else {
              proposal_constitution_content.prop_have_guardrails_script = false
              // If prop_have_guardrails_script is not a boolean or null, return an error
              //return ctx.badRequest(null, "prop_have_guardrails_script must be a boolean or null");
          }
      }
        // Create the Proposal
        try {
          try {
            proposal = await strapi.entityService.create(
                "api::proposal.proposal",
                {
                    data: {
                        ...data,
                        user_id: user?.id?.toString(),
                    },
                }
            );
            if (!proposal?.id) {
                return ctx.badRequest(null, "Proposal not created or missing ID");
            }
        } catch (error) {
            console.error("Error creating proposal:", error);
            return ctx.badRequest(null, "Proposal not created");
        }
        try {
            const proposalContentData = {
                ...data,
                proposal_id: proposal.id.toString(),
                gov_action_type_id: data?.gov_action_type_id?.toString(),
                prop_rev_active: true,
                user_id: user?.id?.toString(),
            };        
            // Only create proposal_constitution_content if gov_action_type_id is 3
            let proposalConstitutionContent = null;
            if (gov_action_type_id == 3 && data.proposal_constitution_content) {
                proposalConstitutionContent = await strapi.entityService.create(
                    "api::proposal-constitution-content.proposal-constitution-content",
                    {
                        data: {
                            prop_constitution_url: data.proposal_constitution_content.prop_constitution_url,
                            prop_have_guardrails_script: data.proposal_constitution_content.prop_have_guardrails_script,
                            ...(data.proposal_constitution_content.prop_have_guardrails_script === true && {
                                prop_guardrails_script_url: data.proposal_constitution_content.prop_guardrails_script_url,
                                prop_guardrails_script_hash: data.proposal_constitution_content.prop_guardrails_script_hash,
                            }),
                        },
                    }
                );
                if (!proposalConstitutionContent?.id) {
                    return ctx.badRequest(null, "Proposal constitution content not created");
                }
                // connect proposal_constitution_content with proposal_content
                proposalContentData.proposal_constitution_content = {
                    connect: [proposalConstitutionContent.id], // over ID
                };
            }        
            proposal_content = await strapi.entityService.create(
                "api::proposal-content.proposal-content",
                {
                    data: proposalContentData,
                }
            );
        } catch (error) {
            console.error("Error creating proposal content:", error);
            // Delete the Proposal because the Proposal content was not created
            await deleteProposal();
            return ctx.badRequest(null, "Proposal content not created");
        }
        //   proposal = await strapi.entityService.create(
        //     "api::proposal.proposal",
        //     {
        //       data: {
        //         ...data,
        //         user_id: user?.id?.toString(),
        //       },
        //     }
        //   );

        //   if (!proposal) {
        //     return ctx.badRequest(null, "Proposal not created");
        //   }
        // } catch (error) {
        //   return ctx.badRequest(null, "Proposal not created");
        // }

        // // Create Proposal content
        // try {
        //   proposal_content = await strapi.entityService.create(
        //       "api::proposal-content.proposal-content",
        //       {
        //           data: {
        //               ...data,
        //               proposal_id: proposal?.id.toString(),
        //               gov_action_type_id: data?.gov_action_type_id?.toString(),
        //               prop_rev_active: true,
        //               user_id: user?.id?.toString(),
        //               proposal_constitution_content: gov_action_type_id == 3 ? {
        //                   prop_constitution_url: data.proposal_constitution_content.prop_constitution_url,
        //                   prop_have_guardrails_script: data.proposal_constitution_content.prop_have_guardrails_script,
        //                   ...(data.proposal_constitution_content.prop_have_guardrails_script === true && {
        //                       prop_guardrails_script_url: data.proposal_constitution_content.prop_guardrails_script_url,
        //                       prop_guardrails_script_hash: data.proposal_constitution_content.prop_guardrails_script_hash,
        //                   }),
        //               } : null, // Only for gov_action_type_id == 3
        //           },
        //       }
        //   );
      } catch (error) {
          // Delete the Proposal because the Proposal content was not created
          await deleteProposal();
      
          return ctx.badRequest(null, "Proposal content not created");
      }

        return this.transformResponse({
          proposal_id: proposal.id,
          proposal_content_id: proposal_content.id,
        });

        // Global error catch
      } catch (error) {
        proposal_content && (await deleteProposalContent());
        proposal && (await deleteProposal());
        ctx.status = 500;
        ctx.body = { error: error, message: error.message };
      }
    },
    async delete(ctx) {
      const { id } = ctx.params;
      try {
        // Delete proposal
        let deletedProposal = await strapi.entityService.delete(
          "api::proposal.proposal",
          id
        );

        if (!deletedProposal) {
          throw new Error("Proposal not found or delete failed");
        }
        // Find all proposal-content entries related to the proposal
        const proposalContents = await strapi.db
            .query("api::proposal-content.proposal-content")
            .findMany({
                where: {
                    proposal_id: id,
                },
                populate: {
                    proposal_constitution_content: true, // Populate the related proposal_constitution_content
                },
            });

        // Delete all related proposal_constitution_content
        for (const proposalContent of proposalContents) {
            if (proposalContent.proposal_constitution_content) {
                await strapi.entityService.delete(
                    "api::proposal-constitution-content.proposal-constitution-content",
                    proposalContent.proposal_constitution_content.id
                );
            }
        }
        // Delete proposal content
        let deletedProposalContent = await strapi.db
          .query("api::proposal-content.proposal-content")
          .deleteMany({
            where: {
              proposal_id: id,
            },
          });
        


        // Handling proposal submitions
        await strapi.db
          .query("api::proposal-submition.proposal-submition")
          .deleteMany({
            where: {
              proposal_id: id,
            },
          });

        // Delete proposal votes
        await strapi.db.query("api::proposal-vote.proposal-vote").deleteMany({
          where: {
            proposal_id: id,
          },
        });

        // Delete comments
        await strapi.db.query("api::comment.comment").deleteMany({
          where: {
            proposal_id: id,
          },
        });

        // Handling polls and poll votes
        const polls = await strapi.db.query("api::poll.poll").findMany({
          where: {
            proposal_id: id,
          },
        });

        for (const poll of polls) {
          await strapi.db.query("api::poll-vote.poll-vote").deleteMany({
            where: {
              poll_id: poll.id,
            },
          });
        }

        await strapi.db.query("api::poll.poll").deleteMany({
          where: {
            proposal_id: id,
          },
        });

        return this.transformResponse(deletedProposal);
      } catch (error) {
        return ctx.badRequest("Failed to delete proposal and related data", {
          error: error.message,
        });
      }
    },
  })
);
