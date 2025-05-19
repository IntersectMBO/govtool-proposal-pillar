const { ValidationError } = require('@strapi/utils').errors;

async function isLocked(costingId) {
  if (!costingId) return false;
  const relatedBds = await strapi.entityService.findMany('api::bd.bd', {
    filters: {
      bd_costing: costingId,
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
      throw new ValidationError('Cannot update costing because related proposal has already been submitted for voting.');
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const isVotingLocked = await isLocked(where.id);
    if (isVotingLocked) {
      throw new ValidationError('Cannot delete costing because related proposal has already been submitted for voting.');
    }
  },

  async beforeCreate(event) {
    const { data } = event.params;
    if (!data) return;

    const bdId = data?.bd; 

    if (!bdId) return;

    const relatedBd = await strapi.entityService.findOne('api::bd.bd', bdId, {
      fields: ['submitted_for_vote'],
    });

    if (relatedBd?.submitted_for_vote) {
      throw new ValidationError('Cannot create costing because related proposal has already been submitted for voting.');
    }
  },
};
