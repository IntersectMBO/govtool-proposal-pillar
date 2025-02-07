module.exports = {
    async up(knex) {
        try {
                    const strapiInstance =  global.strapi;
                    let  result =[];
                    try {
                      result = await knex.raw('ALTER TABLE "public"."strapi_api_token_permissions" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key strapi_api_token_permissions created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."strapi_api_tokens" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key strapi_api_tokens created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."strapi_transfer_token_permissions" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key strapi_transfer_token_permissions created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."strapi_transfer_tokens" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key strapi_transfer_tokens created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."files_related_morphs" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key files_related_morphs created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."files" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key files created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."upload_folders" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key upload_folders created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."strapi_release_actions" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key strapi_release_actions created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."strapi_releases" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key strapi_releases created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."up_permissions" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key up_permissions created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."up_roles" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key up_roles created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."up_users_role_links" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key up_roles created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."up_users" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key up_roles created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    try {
                      result = await knex.raw('ALTER TABLE "public"."route_permissions" ADD PRIMARY KEY ("id")');
                      console.log("Primary Key route_permissions created!");
                    } catch (error) {
                      console.error('Error creating PK:', error);
                    }
                    console.log('Migration 20250502_1 completed!');
    } catch (error) {
        console.error('Error running migration:', error);
      }
    }
}




