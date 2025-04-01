'use strict';

/**
 * comments-report controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}


module.exports = createCoreController('api::comments-report.comments-report', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;

    if (!data || !data.comment) {
      return ctx.badRequest('Comment is mandatory.');
    }
    const existingReports = await strapi.db.query('api::comments-report.comments-report').findMany({
      where: {
         comment: data.comment,
         moderation_status: null },
    });
    let hash = generateRandomString(89);
    ctx.request.body.data.hash = hash;
    let link = ctx.request.header.origin+"/proposal_discussion/proposal_comment_review/"+hash;
    console.log(strapi.plugins['email'].services.email);
    if (existingReports.length >= 2) {
      try {
        let x = await strapi.plugins['email'].services.email.send({
          subject: "Comment Reach report limit!",
          from: process.env.AWS_SES_FROM,
          to: process.env.AWS_SES_TO,
          replayTo: process.env.AWS_SES_REPLYTO,
          html: `We have comment with 3 reports please follow the <a href="${link}">link</a>.`,
        //  text: `We have comment with 3 reports please follow the link.`,
        });
      } catch (error) {
        strapi.log.error('Error sending email:', error);
      }
    }
    const response = await super.create(ctx);
    return response;
  },
}));