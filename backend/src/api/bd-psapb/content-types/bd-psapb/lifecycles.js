const { ValidationError } = require('@strapi/utils').errors;

async function isLocked(psapbId) {
  if (!psapbId) return false;

  const relatedBds = await strapi.entityService.findMany('api::bd.bd', {
    filters: {
      bd_psapb: psapbId,
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
      throw new ValidationError('Cannot update PSAPB section because related proposal has already been submitted for voting.');
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const isVotingLocked = await isLocked(where.id);
    if (isVotingLocked) {
      throw new ValidationError('Cannot delete PSAPB section because related proposal has already been submitted for voting.');
    }
  },
};
