const { ValidationError } = require('@strapi/utils').errors;

async function isVotingLockedFromPoolId(bd_poll_id) {
    if (!bd_poll_id) return false;
  
    const pool = await strapi.entityService.findOne('api::bd-poll.bd-poll', bd_poll_id, {
      fields: ['bd_proposal_id'],
    });
  
    const bdId = pool?.bd_proposal_id;
    if (!bdId) return false;
  
    const bd = await strapi.entityService.findOne('api::bd.bd', bdId, {
      fields: ['submitted_for_vote'],
    });
  
    return !!bd?.submitted_for_vote;
  }
  

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    const isLocked = await isVotingLockedFromPoolId(data.bd_poll_id);
    if (isLocked) {
      throw new ValidationError('Creating poll votes is not allowed after the proposal has been submitted for voting.');
    }
  },

  async beforeUpdate(event) {
    const { where } = event.params;

    const voteEntry = await strapi.entityService.findOne('api::bd-poll-vote.bd-poll-vote', where.id, {
      fields: ['bd_poll_id'],
    });

    const isLocked = await isVotingLockedFromPoolId(voteEntry?.bd_poll_id);
    if (isLocked) {
      throw new ValidationError('Modifying poll votes is not allowed after the proposal has been submitted for voting.');
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;

    const voteEntry = await strapi.entityService.findOne('api::bd-poll-vote.bd-poll-vote', where.id, {
      fields: ['bd_poll_id'],
    });

    const isLocked = await isVotingLockedFromPoolId(voteEntry?.bd_poll_id);
    if (isLocked) {
      throw new ValidationError('Deleting poll votes is not allowed after the proposal has been submitted for voting.');
    }
  },
};
