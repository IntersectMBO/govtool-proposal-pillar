// This script must be run wih first start on old source database
// this is just to copy data to new schema that will not be synced with main schema
module.exports = {
    async up(knex) {
        try {
          let trx = await knex.transaction();
          let result = await trx.raw( `SELECT id, prop_receiving_address, prop_amount
                    FROM proposal_contents
                    WHERE prop_receiving_address IS NOT NULL;`);
          await trx.raw('CREATE SCHEMA IF NOT EXISTS temp');
          await trx.raw(`
             CREATE TABLE IF NOT EXISTS temp.temp_migrate_data (
               id int4 PRIMARY KEY,
               prop_receiving_address VARCHAR(255),
               prop_amount DECIMAL
             );
          `);
          result = await trx.raw(`
            INSERT INTO temp.temp_migrate_data (id, prop_receiving_address, prop_amount)
            SELECT id, prop_receiving_address, prop_amount
            FROM proposal_contents
            WHERE prop_receiving_address IS NOT NULL;
          `);
          console.log("Data coppied to temp table temp_migrate_data");
          await trx.raw('ALTER TABLE proposal_contents DROP COLUMN prop_receiving_address');
          console.log("Columns prop_receiving_address dropped successfully");
          await trx.raw('ALTER TABLE proposal_contents DROP COLUMN prop_amount');
          console.log("Columns prop_amount dropped successfully");
          trx.commit();
          }
            catch(error)
            {
            console.error('Error copping data:', error);
            }
            console.log('Migration 20241121_1 completed!');
          }
}