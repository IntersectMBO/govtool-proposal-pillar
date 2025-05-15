const { ValidationError } = require('@strapi/utils').errors;

async function isLocked(ownershipId) {
  if (!ownershipId) return false;

  const relatedBds = await strapi.entityService.findMany('api::bd.bd', {
    filters: {
      bd_proposal_ownership: ownershipId,
    },
    fields: ['id', 'submitted_for_vote'],
  });

  return relatedBds.some(bd => !!bd.submitted_for_vote);
}

module.exports = {
  async beforeUpdate(event) {
    const { where } = event.params;
    const isVotingLocked = await isLocked(where.id);
    if (isVotingLocked) {
      throw new ValidationError('Cannot update proposal ownership because related proposal has already been submitted for voting.');
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const isVotingLocked = await isLocked(where.id);
    if (isVotingLocked) {
      throw new ValidationError('Cannot delete proposal ownership because related proposal has already been submitted for voting.');
    }
  },
};
