module.exports = {
  routes: [
    {
      method: "GET",
      path: "/bd/versions/:id",
      handler: "bd.bdProposalVersions",
      config: {
        auth: false,
      },
    },
  ],
};
