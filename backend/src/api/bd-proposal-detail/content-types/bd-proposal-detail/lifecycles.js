const { ValidationError } = require('@strapi/utils').errors;

async function isLocked(detailId) {
  if (!detailId) return false;

  const relatedBds = await strapi.entityService.findMany('api::bd.bd', {
    filters: {
      bd_proposal_detail: detailId,
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
      throw new ValidationError('Cannot update proposal detail because related proposal has already been submitted for voting.');
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const isVotingLocked = await isLocked(where.id);
    if (isVotingLocked) {
      throw new ValidationError('Cannot delete proposal detail because related proposal has already been submitted for voting.');
    }
  }
};
