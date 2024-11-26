// This migration is depending on first one 
// This will restore all data to new table from temp schema and drop table and schema.
module.exports = {
    async up(knex) {
        try {
                    const strapiInstance =  global.strapi;
                    let  result =[];
                    try {
                      result = await knex.raw('SELECT * from temp.temp_migrate_data');
                      console.log("Data pulled");
                    } catch (error) {
                      console.error('Error dropping column:', error);
                    }
                    for (const row of result.rows) {
                      let entry =  await global.strapi.entityService.findOne('api::proposal-content.proposal-content', row.id);
                      let updatedEntry = { ...entry };
                      updatedEntry['proposal_withdrawals'] = [
                      {
                          prop_receiving_address: row.prop_receiving_address,
                          prop_amount: row.prop_amount,
                      }];

                      let r = await global.strapi.entityService.update('api::proposal-content.proposal-content', row.id,{
                        data: {proposal_withdrawals:[{
                          prop_receiving_address: row.prop_receiving_address,
                          prop_amount: row.prop_amount,
                        }]
                      }});
                      console.log(`Updated entry with ID ${row.id}`);
                    }
                    try {
                      await knex.raw('DROP TABLE IF EXISTS temp.temp_migrate_data');
                      console.log("Temp table temp_migrate_data deleted");
                      await knex.raw('DROP SCHEMA IF EXISTS temp');
                    } catch (error) {
                      console.error('Error dropping table:', error);
                    }
                    console.log('Migration 20241121_2 completed!');
    } catch (error) {
        console.error('Error running migration:', error);
      }
    }
}