module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/govtool-proxy',
        handler: 'govtool-proxy.fetchData',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };