const axios = require('axios');

module.exports = {
  async fetchData(ctx) {
    try {
      const baseUrl = process.env.GOVTOOL_API_BASE_URL;

      if (!baseUrl) {
        return ctx.throw(500, 'GOVTOOL_API_BASE_URL is not configured');
      }

      const { endpoint } = ctx.request.query;

      if (!endpoint || typeof endpoint !== 'string' || endpoint.trim() === '') {
        return ctx.throw(400, 'Endpoint parameter is required');
      }

      // Reject absolute URLs to prevent SSRF
      if (/^https?:\/\//i.test(endpoint)) {
        return ctx.throw(400, 'Absolute URLs are not allowed');
      }

      // Reject protocol-relative URLs
      if (/^\/\//.test(endpoint)) {
        return ctx.throw(400, 'Protocol-relative URLs are not allowed');
      }

      // Reject path traversal sequences
      if (endpoint.includes('..')) {
        return ctx.throw(400, 'Path traversal is not allowed');
      }

      // Reject null bytes and backslashes
      if (endpoint.includes('\0') || endpoint.includes('\\')) {
        return ctx.throw(400, 'Invalid characters in endpoint');
      }

      const fullUrl = `${baseUrl.replace(/\/$/, '')}/${endpoint}`;

      try {
        new URL(fullUrl);
      } catch (error) {
        return ctx.throw(400, 'Invalid URL');
      }

      const headers = {};
      if (process.env.GOVTOOL_API_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GOVTOOL_API_TOKEN}`;
      }

      const response = await axios.get(fullUrl, { headers });

      ctx.send(response.data);
    } catch (error) {
      if (error.status) throw error;
      strapi.log.error('GovTool proxy error:', error);
      ctx.throw(500, 'Error fetching data from external API', { error });
    }
  },
};
