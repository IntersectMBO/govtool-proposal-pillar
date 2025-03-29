'use strict';

/**
 * bd controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::bd.bd',
    ({ strapi }) => ({
   async create(ctx) {
       const user = ctx.state.user;
       const data = ctx.request.body.data;
       console.log(data);
       const newbdg = await strapi.entityService.create("api::bd.bd",{data:{creator: user.id, ...data}})
       return this.transformResponse(newbdg);
   }
})
)