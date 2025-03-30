// @ts-nocheck
"use strict";

/**
 * bd-poll-vote controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::bd-poll-vote.bd-poll-vote",
  ({ strapi }) => ({
    async create(ctx) {
      const { data } = ctx?.request?.body;
      data.drep_voting_power=data?.drep_voting_power?.toString()||'0';
      const { vote_result: voteResult, bd_poll_id: pollId } = data;
      const user = ctx?.state?.user;
      if (!user) {
        return ctx.badRequest("User is required");
      }

      if (voteResult !== true && voteResult !== false) {
        return ctx.badRequest("Vote result is required");
      }

      if (!pollId) {
        return ctx.badRequest("Poll ID is required");
      }

      let pollVote;
      let poll;

      // Delete the Poll Vote
      const deletePollVote = async () => {
        let deletedPollVote = await strapi.entityService.delete(
          "api::bd-poll-vote.bd-poll-vote",
          pollVote?.id
        );

        if (!deletedPollVote) {
          return ctx.badRequest("Poll vote not deleted");
        }
      };

      try {
        // Check if vote already exist
        try {
          const findVote = await strapi.entityService.findMany(
            "api::bd-poll-vote.bd-poll-vote",
            {
              filters: {
                $and: [
                  {
                    user_id: user?.id?.toString(),
                  },
                  {
                    bd_poll_id: pollId?.toString(),
                  },
                ],
              },
            }
          );
          if (findVote?.length > 0) {
            return ctx.badRequest("Poll vote for this user already exist");
          }
        } catch (error) {
          ctx.status = 500;
          ctx.body = { error: error, message: error.message };
        }
        // Create the Poll Vote
        try {
          pollVote = await strapi.entityService.create(
            "api::bd-poll-vote.bd-poll-vote",
            { data: { ...data, user_id: `${user.id}` } }
          );
          if (!pollVote) {
            return ctx.badRequest("Poll vote not created");
          }
        } catch (error) {
          return ctx.badRequest("Poll vote not created");
        }

        // Get the Poll
        try {
          poll = await strapi.entityService.findOne(
            "api::bd-poll.bd-poll",
            pollVote?.bd_poll_id
          );

          if (!poll) {
            // Delete the Poll Vote because the Poll was not found
            await deletePollVote();

            return ctx.badRequest("Poll not found");
          }
        } catch (error) {
          // Delete the Poll Vote because the Poll was not found
          await deletePollVote();

          return ctx.badRequest("Poll not found");
        }

        const fieldToUpdate = data?.vote_result ? "poll_yes" : "poll_no";
        let updatedPoll;

        // Update the Poll
        try {
          updatedPoll = await strapi.entityService.update(
            "api::bd-poll.bd-poll",
            poll?.id,
            {
              data: {
                [fieldToUpdate]: poll[fieldToUpdate] + 1,
              },
            }
          );

          if (!updatedPoll) {
            // Delete the Poll Vote because the Poll was not updated
            await deletePollVote();

            return ctx.badRequest("Poll not updated");
          }
        } catch (error) {
          // Delete the Poll Vote because the Poll was not updated
          await deletePollVote();

          return ctx.badRequest("Poll not updated");
        }

        return this.transformResponse(pollVote);
        // Global error catch
      } catch (error) {
        pollVote && (await deletePollVote());
        ctx.status = 500;
        ctx.body = { error: error, message: error.message };
      }
    },
    async update(ctx) {
      const { id } = ctx.params;
      const { data } = ctx?.request?.body;
      const { vote_result: voteResult } = data;

      const user = ctx?.state?.user;

      if (!user) {
        return ctx.badRequest("User is required");
      }

      if (voteResult !== true && voteResult !== false) {
        return ctx.badRequest("Vote result is required");
      }

      let pollVote;
      let updatedPollVote;
      let poll;

      const rollbackPollVote = async () => {
        const rollbackedPollVote = await strapi.entityService.update(
          "api::bd-poll-vote.bd-poll-vote",
          pollVote?.id,
          { data: { vote_result: pollVote.vote_result } }
        );
        if (!rollbackedPollVote) {
          return ctx.badRequest("Poll vote not updated to initial state");
        }

        return ctx.badRequest("Poll vote not updated");
      };
      const rollbackPoll = async () => {
        const rollbackedPoll = await strapi.entityService.update(
          "api::bd-poll.bd-poll",
          poll.id,
          { data: { poll_yes: poll.poll_yes, poll_no: poll.poll_no } }
        );
        if (!rollbackedPoll) {
          return ctx.badRequest("Poll not updated to initial state");
        }

        return ctx.badRequest("Poll vote not updated");
      };

      try {
        try {
          pollVote = await strapi.entityService.findOne(
            "api::bd-poll-vote.bd-poll-vote",
            id
          );

          if (!pollVote) {
            return ctx.badRequest("Poll vote not found");
          }

          if (pollVote?.vote_result === voteResult) {
            return ctx.badRequest("Poll vote already updated");
          }

          updatedPollVote = await strapi.entityService.update(
            "api::bd-poll-vote.bd-poll-vote",
            id,
            { data: { ...pollVote, vote_result: voteResult } }
          );

          if (!updatedPollVote) {
            return ctx.badRequest("Poll vote not updated");
          }
        } catch (error) {
          return ctx.badRequest("Poll vote not updated");
        }

        try {
          poll = await strapi.entityService.findOne(
            "api::bd-poll.bd-poll",
            pollVote?.bd_poll_id
          );
          if (!poll) {
            return ctx.badRequest("Poll not found");
          }
        } catch (error) {
          return ctx.badRequest("Poll not found");
        }

        // Update the Poll
        try {
          const updatedPoll = await strapi.entityService.update(
            "api::bd-poll.bd-poll",
            poll?.id,
            {
              data: {
                ...poll,
                [voteResult ? "poll_yes" : "poll_no"]:
                  poll[voteResult ? "poll_yes" : "poll_no"] + 1,
                [voteResult ? "poll_no" : "poll_yes"]:
                  poll[voteResult ? "poll_no" : "poll_yes"] - 1,
              },
            }
          );
          if (!updatedPoll) {
            await rollbackPollVote();
            return ctx.badRequest("Poll not updated");
          }

          return this.transformResponse(updatedPollVote);
        } catch (error) {
          return ctx.badRequest("Poll not updated");
        }
      } catch (error) {
        pollVote && (await rollbackPollVote());
        poll && (await rollbackPoll());
        ctx.status = 500;
        ctx.body = { error: error, message: error.message };
      }
    },
  })
);
