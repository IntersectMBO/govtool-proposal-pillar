module.exports = {
    async up(knex) {
        try {
                    const strapiInstance =  global.strapi;
                    let  result =[];
                    try {
                      result = await knex.raw('update governance_action_types set gov_action_type_name =\'Info Action\' where id = 1');
                      console.log("Update name Info to Info Action");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('update governance_action_types set gov_action_type_name =\'Treasury requests\' where id = 2');
                      console.log("Update name Treasury to Treasury requests");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('insert into governance_action_types values(3,\'Updates to the Constitution\',NOW(),NOW(),NOW(),1,1)');
                      console.log("Insert Updates to the Constitution with id 3.");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    console.log('Migration 20250502_2 completed!');
    } catch (error) {
        console.error('Error running migration:', error);
      }
    }
}




