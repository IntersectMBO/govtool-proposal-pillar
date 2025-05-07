module.exports = ({ env }) => ({
  // Sentry plugin configuration
  sentry: {
    enabled: true, // Enable Sentry integration
    config: {
      dsn: env("SENTRY_DSN"), // Set Sentry DSN from environment variable
      sendMetadata: true, // Enable sending metadata to Sentry
      init: {
				environment: env('APP_ENV'),
			},
    },
  },
  // Documentation plugin configuration
  documentation: {
    enabled: true, // Enable the Documentation plugin
    config: {
      info: { version: "1.0.0" }, // Set the documentation version
      "x-strapi-config": {
        plugins: ["users-permissions"], // Additional plugin configuration (currently empty)
      },
    },
  },
  email: {
    config: {
      provider: 'amazon-ses',
      providerOptions: {
        key: env('AWS_SES_KEY'),
        secret: env('AWS_SES_SECRET'),
        amazon: env('AWS_SES_ENDPOINT'),
      },
      settings: {
        defaultFrom: env('AWS_SES_FROM'),
        defaultReplyTo: env('AWS_SES_REPLYTO'),
      },
    },
  },
});
