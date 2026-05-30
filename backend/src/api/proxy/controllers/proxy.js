"use strict";
const axios = require("axios");

/**
 * Proxy controller — scoped to GovTool API only.
 *
 * The generic POST /proxy endpoint (forward handler) has been removed.
 * It was an unauthenticated open SSRF proxy that allowed any caller to
 * make the server fetch arbitrary URLs, including cloud metadata and
 * internal services.  See issue #4168.
 *
 * The remaining endpoints forward requests exclusively to the
 * GOVTOOL_API_BASE_URL configured in the environment.
 */

// Allowed path segments for the GovTool proxy.
// Reject any endpoint containing ".." or starting with "/" to prevent
// URL traversal and host-relative redirects.
const BLOCKED_PATTERNS = [/\.\./, /^\/+/, /:\/\//];

function validateEndpoint(endpoint) {
  if (!endpoint) return false;
  return !BLOCKED_PATTERNS.some((rx) => rx.test(endpoint));
}

module.exports = {
  // GET /proxy/govtool/:endpoint*
  async getGovtoolData(ctx) {
    try {
      const endpoint = ctx.params.endpoint;
      if (!endpoint) return ctx.badRequest("Endpoint is required");
      if (!validateEndpoint(endpoint)) {
        return ctx.badRequest("Invalid endpoint path");
      }
      const baseUrl = process.env.GOVTOOL_API_BASE_URL;
      if (!baseUrl) {
        strapi.log.error("GOVTOOL_API_BASE_URL is not configured");
        return ctx.internalServerError("Proxy target not configured");
      }
      const fullUrl = `${baseUrl.replace(/\/$/, "")}/${endpoint}`;
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
      if (!validateEndpoint(endpoint)) {
        return ctx.badRequest("Invalid endpoint path");
      }
      const baseUrl = process.env.GOVTOOL_API_BASE_URL;
      if (!baseUrl) {
        strapi.log.error("GOVTOOL_API_BASE_URL is not configured");
        return ctx.internalServerError("Proxy target not configured");
      }

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
