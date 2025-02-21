module.exports = {
  async up(knex) {
      try {
          // Check if the row with id = 4 already exists before inserting
          const row3 = await knex('governance_action_types')
              .where({ id: 4 })
              .first();

          if (!row3) {
              await knex('governance_action_types').insert({
                  id: 3,
                  gov_action_type_name: 'Motion of No Confidence',
                  created_at: knex.fn.now(),
                  updated_at: knex.fn.now(),
                  published_at: knex.fn.now(), // Ensure published_at is set
                  created_by_id: 1,
                  updated_by_id: 1,
              });
              console.log("Inserted 'Motion of No Confidence' with id = 4 and set published_at.");
          } else {
              console.log("Row with id = 4 already exists. No insert needed.");
          }

          console.log('Migration 20252002_1 completed!');
      } catch (error) {
          console.error('Error running migration:', error);
      }
  },
};