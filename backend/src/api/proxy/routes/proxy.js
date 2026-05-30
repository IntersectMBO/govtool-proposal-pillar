'use strict';

module.exports = {
  routes: [
    // NOTE: The generic POST /proxy (forward) route has been removed.
    // It was an unauthenticated open SSRF proxy. See issue #4168.
    {
      method: 'GET',
      path: '/proxy/govtool/:endpoint*',
      handler: 'proxy.getGovtoolData',
      config: {
        roles: ['authenticated'],
        auth: true
      },
    },
    {
      method: 'POST',
      path: '/proxy/govtool/:endpoint*',
      handler: 'proxy.postGovtoolData',
      config: {
        roles: ['authenticated'],
        auth: true
      },
    },
  ],
};
