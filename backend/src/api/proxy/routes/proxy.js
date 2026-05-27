'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/proxy/govtool/:endpoint*',
      handler: 'proxy.getGovtoolData',
      config: {
        roles: ['authenticated', 'public'],
        auth: false
      },
    },
    {
      method: 'POST',
      path: '/proxy/govtool/:endpoint*',
      handler: 'proxy.postGovtoolData',
      config: {
        roles: ['authenticated', 'public'],
        auth: false
      },
    },
  ],
};
