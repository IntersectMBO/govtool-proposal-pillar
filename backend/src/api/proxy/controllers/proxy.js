"use strict";
const axios = require("axios");

// Allowed base URL for proxy requests — only the GovTool API
const GOVTOOL_BASE_URL = process.env.GOVTOOL_API_BASE_URL;

/**
 * Validate that the resolved URL targets the configured GovTool API host.
 * Rejects any URL that does not match the expected host to prevent SSRF.
 */
function validateGovtoolUrl(fullUrl) {
  if (!GOVTOOL_BASE_URL) {
    throw new Error("GOVTOOL_API_BASE_URL is not configured");
  }
  const allowedOrigin = new URL(GOVTOOL_BASE_URL).origin;
  const targetOrigin = new URL(fullUrl).origin;
  if (targetOrigin !== allowedOrigin) {
    throw new Error("Request URL does not match the allowed GovTool API host");
  }
}

module.exports = {
  // NOTE: The previous unrestricted POST /proxy endpoint has been removed.
  // It allowed unauthenticated SSRF to any URL and was a dev convenience
  // that should never have shipped to production. See issue #4168.

  // GET /proxy/govtool/:endpoint*
  async getGovtoolData(ctx) {
    try {
      const endpoint = ctx.params.endpoint;
      if (!endpoint) return ctx.badRequest("Endpoint is required");

      if (!GOVTOOL_BASE_URL) {
        return ctx.internalServerError("GOVTOOL_API_BASE_URL is not configured");
      }

      const fullUrl = `${GOVTOOL_BASE_URL.replace(/\/$/, "")}/${endpoint}`;

      // SSRF guard: only allow requests to the configured GovTool API
      validateGovtoolUrl(fullUrl);

      const response = await axios.get(fullUrl, {
        params: ctx.query,
        headers: {},
      });

      ctx.send({ status: response.status, data: response.data });
    } catch (error) {
      if (error.message?.includes("does not match") || error.code === "ERR_INVALID_URL") {
        ctx.status = 400;
        ctx.body = { error: "Invalid request URL" };
        return;
      }
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

      if (!GOVTOOL_BASE_URL) {
        return ctx.internalServerError("GOVTOOL_API_BASE_URL is not configured");
      }

      const fullUrl = `${GOVTOOL_BASE_URL.replace(/\/$/, "")}/${endpoint}`;

      // SSRF guard: only allow requests to the configured GovTool API
      validateGovtoolUrl(fullUrl);

      const response = await axios.post(fullUrl, ctx.request.body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      ctx.send({ status: response.status, data: response.data });
    } catch (error) {
      if (error.message?.includes("does not match") || error.code === "ERR_INVALID_URL") {
        ctx.status = 400;
        ctx.body = { error: "Invalid request URL" };
        return;
      }
      strapi.log.error("GovTool POST error:", error);
      ctx.status = error.response?.status || 500;
      ctx.body = {
        error: error.message,
        details: error.response?.data || null,
      };
    }
  },
};
