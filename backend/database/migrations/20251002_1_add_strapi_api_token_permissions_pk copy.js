module.exports = {
  async up(knex) {
    try {
      const strapiInstance = global.strapi;
      const tables = [
        'strapi_api_token_permissions',
        'strapi_api_tokens',
        'strapi_transfer_token_permissions',
        'strapi_transfer_tokens',
        'files_related_morphs',
        'files',
        'upload_folders',
        'strapi_release_actions',
        'strapi_releases',
        'up_permissions',
        'up_roles',
        'up_users_role_links',
        'up_users',
        'route_permissions'
      ];
      for (const table of tables) {
        try {
          const primaryKeyCheck = await knex.raw(`
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_name = '${table}' AND constraint_type = 'PRIMARY KEY';
          `);

          if (primaryKeyCheck.rows.length === 0) {
            // No primary key exists, create one
            await knex.raw(`ALTER TABLE "public"."${table}" ADD PRIMARY KEY ("id")`);
            console.log(`Primary Key for ${table} created!`);
          } else {
            console.log(`Primary Key already exists for ${table}.`);
          }
        } catch (error) {
          console.error(`Error checking/creating PK for ${table}:`, error);
        }
      }

      console.log('Migration 20250502_1 completed!');
    } catch (error) {
      console.error('Error running migration:', error);
    }
  }
};
