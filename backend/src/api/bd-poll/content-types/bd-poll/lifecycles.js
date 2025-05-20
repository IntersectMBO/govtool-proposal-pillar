const { ValidationError } = require('@strapi/utils').errors;

module.exports = {
  async beforeUpdate(event) {
    const { where } = event.params;
    const existingPool = await strapi.entityService.findOne('api::bd-poll.bd-poll', where.id, {
      fields: ['bd_proposal_id'],
    });
    const bdId = existingPool?.bd_proposal_id;
    if (!bdId) return; 
    const relatedBd = await strapi.entityService.findOne('api::bd.bd', bdId, {
      fields: ['submitted_for_vote'],
    });
    if (relatedBd?.submitted_for_vote) {
      throw new ValidationError('Update is not allowed because the related BD entry has already been submitted for voting.');
    }
  },
  async beforeDelete(event) {
    const { where } = event.params;
    const existingPool = await strapi.entityService.findOne('api::bd-poll.bd-poll', where.id, {
      fields: ['bd_proposal_id'],
    });
    const bdId = existingPool?.bd_proposal_id;
    if (!bdId) return; 
    const relatedBd = await strapi.entityService.findOne('api::bd.bd', bdId, {
      fields: ['submitted_for_vote'],
    });
    if (relatedBd?.submitted_for_vote) {
      throw new ValidationError('Deletion is not allowed because the related BD entry has already been submitted for voting.');
    }
  },
  async beforeCreate(event) {
    const { data } = event;
    const bdId = data?.bd_proposal_id;
    if (!bdId) return; 
    const relatedBd = await strapi.entityService.findOne('api::bd.bd', bdId, {
      fields: ['submitted_for_vote'],
    });
    if (relatedBd?.submitted_for_vote) {
      throw new ValidationError('Creation is not allowed because the related BD entry has already been submitted for voting.');
    }
  },
};
