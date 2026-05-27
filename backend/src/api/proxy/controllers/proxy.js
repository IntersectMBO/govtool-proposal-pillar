"use strict";
const axios = require("axios");

/**
 * Validates that an endpoint path is safe and cannot be used for SSRF or path traversal.
 * @param {string} endpoint - The endpoint path to validate
 * @returns {{ valid: boolean, error?: string }}
 */
function validateEndpoint(endpoint) {
  if (!endpoint || typeof endpoint !== "string" || endpoint.trim() === "") {
    return { valid: false, error: "Endpoint is required" };
  }

  // Reject absolute URLs to prevent SSRF
  if (/^https?:\/\//i.test(endpoint)) {
    return { valid: false, error: "Absolute URLs are not allowed" };
  }

  // Reject protocol-relative URLs
  if (/^\/\//.test(endpoint)) {
    return { valid: false, error: "Protocol-relative URLs are not allowed" };
  }

  // Reject path traversal sequences
  if (endpoint.includes("..")) {
    return { valid: false, error: "Path traversal is not allowed" };
  }

  // Reject null bytes
  if (endpoint.includes("\0")) {
    return { valid: false, error: "Null bytes are not allowed" };
  }

  // Reject backslashes (Windows path traversal)
  if (endpoint.includes("\\")) {
    return { valid: false, error: "Backslashes are not allowed" };
  }

  return { valid: true };
}

module.exports = {
  // GET /proxy/govtool/:endpoint*
  async getGovtoolData(ctx) {
    try {
      const endpoint = ctx.params.endpoint;
      const validation = validateEndpoint(endpoint);
      if (!validation.valid) {
        return ctx.badRequest(validation.error);
      }

      const baseUrl = process.env.GOVTOOL_API_BASE_URL;
      if (!baseUrl) {
        return ctx.internalServerError("GOVTOOL_API_BASE_URL is not configured");
      }

      const fullUrl = `${baseUrl.replace(/\/$/, "")}/${endpoint}`;

      const headers = {};
      if (process.env.GOVTOOL_API_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GOVTOOL_API_TOKEN}`;
      }

      const response = await axios.get(fullUrl, {
        params: ctx.query,
        headers,
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
      const validation = validateEndpoint(endpoint);
      if (!validation.valid) {
        return ctx.badRequest(validation.error);
      }

      const baseUrl = process.env.GOVTOOL_API_BASE_URL;
      if (!baseUrl) {
        return ctx.internalServerError("GOVTOOL_API_BASE_URL is not configured");
      }

      const fullUrl = `${baseUrl.replace(/\/$/, "")}/${endpoint}`;

      const headers = {
        "Content-Type": "application/json",
      };
      if (process.env.GOVTOOL_API_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GOVTOOL_API_TOKEN}`;
      }

      const response = await axios.post(fullUrl, ctx.request.body, {
        headers,
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
