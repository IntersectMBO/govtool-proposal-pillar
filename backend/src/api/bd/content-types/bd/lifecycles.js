const { ValidationError } = require('@strapi/utils').errors;
const _ = require('lodash');

const IGNORED_FIELDS = [
  'updatedAt',
  'updatedBy',
  'creator',
  'bd_costing',
  'bd_proposal_detail',
  'bd_contact_information',
  'bd_further_information',
  'bd_psapb',
  'bd_proposal_ownership',
  'old_ver',
];

module.exports = {
  async beforeUpdate(event) {
    const { where, data } = event.params;

    const existingEntry = await strapi.entityService.findOne('api::bd.bd', where.id);

    if (!existingEntry?.submitted_for_vote) return;

    // Ukloni prop_comments_number i ignorisana polja
    const fieldsToCheck = Object.keys(data).filter(
      key => key !== 'prop_comments_number' && !IGNORED_FIELDS.includes(key)
    );

    const changedFields = [];

    for (const key of fieldsToCheck) {
      const newVal = data[key];
      const oldVal = existingEntry[key];

      if (!_.isEqual(newVal, oldVal)) {
        changedFields.push({
          field: key,
          from: oldVal,
          to: newVal
        });
      }
    }

    if (changedFields.length > 0) {
      const fieldList = changedFields.map(f => `${f.field} (from: ${JSON.stringify(f.from)}, to: ${JSON.stringify(f.to)})`);
      throw new ValidationError(
        `Only "prop_comments_number" can be changed after submission for voting. Changed fields: ${fieldList.join('; ')}`
      );
    }
  },
  async beforeDelete(event) {
    const { where } = event.params;

    const existingEntry = await strapi.entityService.findOne('api::bd.bd', where.id, {
      fields: ['submitted_for_vote'],
    });

    if (existingEntry?.submitted_for_vote) {
      throw new ValidationError('Deletion is not allowed because this entry has already been submitted for voting.');
    }
  },
};
