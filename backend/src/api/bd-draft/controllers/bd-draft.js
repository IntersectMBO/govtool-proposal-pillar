'use strict';

/**
 * bd-draft controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::bd-draft.bd-draft',
    ({ strapi }) => ({
        async create(ctx) {
            const user = ctx.state.user;
            const data = ctx.request.body.data;
            const newbdg = await strapi.entityService.create("api::bd-draft.bd-draft",{data:{creator: user.id, ...data}})
            return this.transformResponse(newbdg);
        },
        async find(ctx) {
            const user = ctx.state.user;
            if (!user) {
              return ctx.unauthorized("You must be logged in to access this resource");
            }
            ctx.query = {
              ...ctx.query,
              filters: {
                ...(typeof ctx.query.filters === 'object' && ctx.query.filters !== null ? ctx.query.filters : {}),
                creator: user.id
              }
            };
            const { data, meta } = await super.find(ctx);
            
            return { data, meta };
        },
        async findOne(ctx) {
            const user = ctx.state.user;
            const { id } = ctx.params;
            if (!user) {
              return ctx.unauthorized("You must be logged in to access this resource");
            }
            const entity = await strapi.entityService.findOne(
              "api::bd-draft.bd-draft",
              id,
              {
                populate: ['creator']
              }
            );
          
            if (!entity || entity.creator.id !== user.id) {
              return ctx.notFound("Resource not found or you don't have access");
            }
            const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
            return this.transformResponse(sanitizedEntity);
        },
        async update(ctx) {
            const user = ctx.state.user;
            const { id } = ctx.params;
            const data = ctx.request.body.data;          
            if (!user) {
              return ctx.unauthorized("You must be logged in to update this resource");
            }
            const existingEntity = await strapi.entityService.findOne(
              "api::bd-draft.bd-draft",
              id,
              {
                populate: ['creator']
              }
            );
          
            if (!existingEntity || existingEntity.creator.id !== user.id) {
              return ctx.notFound("Resource not found or you don't have permission to update it");
            }          
            const updatedEntity = await strapi.entityService.update(
              "api::bd-draft.bd-draft",
              id,
              {
                data: {
                  ...data,
                }
              }
            );          
            return this.transformResponse(updatedEntity);
        },
        async delete(ctx) {
            const user = ctx.state.user;
            const { id } = ctx.params;
            if (!user) {
              return ctx.unauthorized("You must be logged in to delete this resource");
            }
            const existingEntity = await strapi.entityService.findOne(
              "api::bd-draft.bd-draft",
              id,
              {
                populate: ['creator']
              }
            );
            if (!existingEntity || existingEntity.creator.id !== user.id) {
              return ctx.notFound("Resource not found or you don't have permission to delete it");
            }
            const deletedEntity = await strapi.entityService.delete(
              "api::bd-draft.bd-draft",
              id
            );
            return this.transformResponse(deletedEntity);
        }
    })
)
