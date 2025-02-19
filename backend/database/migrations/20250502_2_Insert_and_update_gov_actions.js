module.exports = {
  async up(knex) {
      try {
          // Check if the row with id = 1 exists and if the value needs to be updated
          const row1 = await knex('governance_action_types')
              .where({ id: 1 })
              .first();

          if (row1 && row1.gov_action_type_name !== 'Info Action') {
              await knex('governance_action_types')
                  .where({ id: 1 })
                  .update({
                      gov_action_type_name: 'Info Action',
                      published_at: knex.fn.now() // Ensure published_at is set
                  });
              console.log("Updated name 'Info' to 'Info Action' for id = 1 and set published_at.");
          } else {
              console.log("No update needed for id = 1. Value is already correct or row does not exist.");
          }

          // Check if the row with id = 2 exists and if the value needs to be updated
          const row2 = await knex('governance_action_types')
              .where({ id: 2 })
              .first();

          if (row2 && row2.gov_action_type_name !== 'Treasury requests') {
              await knex('governance_action_types')
                  .where({ id: 2 })
                  .update({ 
                      gov_action_type_name: 'Treasury requests',
                      published_at: knex.fn.now() // Ensure published_at is set
                  });
              console.log("Updated name 'Treasury' to 'Treasury requests' for id = 2 and set published_at.");
          } else {
              console.log("No update needed for id = 2. Value is already correct or row does not exist.");
          }

          // Check if the row with id = 3 already exists before inserting
          const row3 = await knex('governance_action_types')
              .where({ id: 3 })
              .first();

          if (!row3) {
              await knex('governance_action_types').insert({
                  id: 3,
                  gov_action_type_name: 'Updates to the Constitution',
                  created_at: knex.fn.now(),
                  updated_at: knex.fn.now(),
                  published_at: knex.fn.now(), // Ensure published_at is set
                  created_by_id: 1,
                  updated_by_id: 1,
              });
              console.log("Inserted 'Updates to the Constitution' with id = 3 and set published_at.");
          } else {
              console.log("Row with id = 3 already exists. No insert needed.");
          }

          console.log('Migration 20250502_2 completed!');
      } catch (error) {
          console.error('Error running migration:', error);
      }
  },
};