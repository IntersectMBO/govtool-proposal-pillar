"use strict";
const axios = require("axios");

module.exports = {
  // POST /proxy
  async forward(ctx) {
    console.log("🚀 ~ forward ~ ctx:", ctx);
    try {
      const {
        url,
        method = "GET",
        data = {},
        params = {},
        headers = {},
      } = ctx.request.body;
      const response = await axios({ url, method, data, params, headers });
      ctx.send({ status: response.status, data: response.data });
    } catch (error) {
      strapi.log.error("Proxy error:", error);
      ctx.status = error.response?.status || 500;
      ctx.body = {
        error: error.message,
        details: error.response?.data || null,
      };
    }
  },

  // GET /proxy/govtool/:endpoint*
  async getGovtoolData(ctx) {
    try {
      const endpoint = ctx.params.endpoint;
      if (!endpoint) return ctx.badRequest("Endpoint is required");
      console.log(endpoint);
      const baseUrl = process.env.GOVTOOL_API_BASE_URL;
      const fullUrl = `${baseUrl.replace(/\/$/, "")}/${endpoint}`;
      console.log(fullUrl);
      const response = await axios.get(fullUrl, {
        params: ctx.query,
        headers: {
          // Authorization: `Bearer ${process.env.GOVTOOL_API_TOKEN}`,
        },
      });

      ctx.send({ status: response.status, data: response.data });
    } catch (error) {
      strapi.log.error("GovTool GET error:", error);
      ctx.status = error.response?.status || 500;
      ctx.body = {
        error: error.message,
        details: error.response?.data || null,
      };
    }
  },

  async postGovtoolData(ctx) {
    try {
      const endpoint = ctx.params.endpoint;
      if (!endpoint) return ctx.badRequest("Endpoint is required");

      const baseUrl = process.env.GOVTOOL_API_BASE_URL;
      const fullUrl = `${baseUrl.replace(/\/$/, "")}/${endpoint}`;

      const response = await axios.post(fullUrl, ctx.request.body, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.GOVTOOL_API_TOKEN}`,
        },
      });

      ctx.send({ status: response.status, data: response.data });
    } catch (error) {
      strapi.log.error("GovTool POST error:", error);
      ctx.status = error.response?.status || 500;
      ctx.body = {
        error: error.message,
        details: error.response?.data || null,
      };
    }
  },
};
