const { ValidationError } = require('@strapi/utils').errors;

async function isLocked(contactInfoId) {
  if (!contactInfoId) return false;

  const relatedBds = await strapi.entityService.findMany('api::bd.bd', {
    filters: {
      bd_contact_information: contactInfoId,
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
      throw new ValidationError('Cannot update contact information because related proposal has already been submitted for voting.');
    }
  },

  async beforeDelete(event) {
    const { where } = event.params;
    const isVotingLocked = await isLocked(where.id);
    if (isVotingLocked) {
      throw new ValidationError('Cannot delete contact information because related proposal has already been submitted for voting.');
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
      throw new ValidationError('Cannot create contact information because related proposal has already been submitted for voting.');
    }
  },
};
