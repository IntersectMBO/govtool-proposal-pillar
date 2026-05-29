'use strict';

module.exports = {
  routes: [
    // NOTE: The unrestricted POST /proxy route has been removed.
    // It allowed unauthenticated SSRF to any arbitrary URL (issue #4168).
    // Only the GovTool-specific proxy routes below are retained, and they
    // now validate that the target URL matches GOVTOOL_API_BASE_URL.

    {
      method: 'GET',
      path: '/proxy/govtool/:endpoint*',
      handler: 'proxy.getGovtoolData',
      config: {
        roles: ['authenticated', 'public'],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/proxy/govtool/:endpoint*',
      handler: 'proxy.postGovtoolData',
      config: {
        roles: ['authenticated', 'public'],
        auth: false,
      },
    },
  ],
};
