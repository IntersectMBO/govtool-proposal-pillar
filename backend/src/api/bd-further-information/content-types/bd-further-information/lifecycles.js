const { ValidationError } = require('@strapi/utils').errors;

async function isLocked(furtherInfoId) {
  if (!furtherInfoId) return false;

  const relatedBds = await strapi.entityService.findMany('api::bd.bd', {
    filters: {
      bd_further_information: furtherInfoId,
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
      throw new ValidationError('Cannot update further information because related proposal has already been submitted for voting.');
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const isVotingLocked = await isLocked(where.id);
    if (isVotingLocked) {
      throw new ValidationError('Cannot delete further information because related proposal has already been submitted for voting.');
    }
  },
};
