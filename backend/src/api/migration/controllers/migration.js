module.exports = {
  async migrateCountries(ctx) {
    // @ts-ignore
    const body = ctx.request.body;

    const data = body?.data;

    const countryList = await strapi.entityService.findMany(
      "api::country-list.country-list"
    );

    if (countryList.length > 0) {
      return {
        success: false,
        message: "Country List already exists",
      };
    }

    for (const country of data) {
      try {
        await strapi.entityService.create("api::country-list.country-list", {
          data: {
            country_name: country.country_name,
            alfa_2_code: country.alfa_2_code,
            alfa_3_code: country.alfa_3_code,
            publishedAt: new Date(),
          },
        });
      } catch (error) {
        console.error(`Error creating country ${country.country_name}:`, error);
      }
    }

    return {
      success: true,
    };
  },
  async migrateCurrencies(ctx) {
    // @ts-ignore
    const body = ctx.request.body;

    const data = body?.data;

    const currencyList = await strapi.entityService.findMany(
      "api::bd-currency-list.bd-currency-list"
    );

    if (currencyList.length > 0) {
      return {
        success: false,
        message: "Currency List already exists",
      };
    }
    for (const currency of data) {
      try {
        await strapi.entityService.create(
          "api::bd-currency-list.bd-currency-list",
          {
            data: {
              currency_name: currency.currency_name,
              currency_letter_code: currency.currency_letter_code,
              currency_number_code: currency.currency_number_code,
              publishedAt: new Date(),
            },
          }
        );
      } catch (error) {
        console.error(
          `Error creating currency ${currency.currency_name}:`,
          error
        );
      }
    }

    return {
      success: true,
    };
  },

  async migrateContractTypes(ctx) {
    // @ts-ignore
    const body = ctx.request.body;

    const data = body?.data;

    const contractTypeList = await strapi.entityService.findMany(
      "api::bd-contract-type.bd-contract-type"
    );

    if (contractTypeList.length > 0) {
      return {
        success: false,
        message: "Contract Type List already exists",
      };
    }
    for (const contractType of data) {
      try {
        await strapi.entityService.create(
          "api::bd-contract-type.bd-contract-type",
          {
            data: {
              contract_type_name: contractType.contract_type_name,
              publishedAt: new Date(),
            },
          }
        );
      } catch (error) {
        console.error(
          `Error creating contract type ${contractType.contract_type_name}:`,
          error
        );
      }
    }

    return {
      success: true,
    };
  },

  async migrateRoadMap(ctx) {
    // @ts-ignore
    const body = ctx.request.body;

    const data = body?.data;

    const roadMapList = await strapi.entityService.findMany(
      "api::bd-road-map.bd-road-map"
    );

    if (roadMapList.length > 0) {
      return {
        success: false,
        message: "Road Map List already exists",
      };
    }
    for (const roadMap of data) {
      try {
        await strapi.entityService.create("api::bd-road-map.bd-road-map", {
          data: {
            roadmap_name: roadMap.roadmap_name,
            publishedAt: new Date(),
          },
        });
      } catch (error) {
        console.error(
          `Error creating road map ${roadMap.roadmap_name}:`,
          error
        );
      }
    }

    return {
      success: true,
    };
  },

  async migrateBdTypes(ctx) {
    // @ts-ignore
    const body = ctx.request.body;

    const data = body?.data;

    const bdTypeList = await strapi.entityService.findMany(
      "api::bd-type.bd-type"
    );

    if (bdTypeList.length > 0) {
      return {
        success: false,
        message: "BD Type List already exists",
      };
    }
    for (const bdType of data) {
      try {
        await strapi.entityService.create("api::bd-type.bd-type", {
          data: {
            type_name: bdType.type_name,
            publishedAt: new Date(),
          },
        });
      } catch (error) {
        console.error(`Error creating bd type ${bdType.type_name}:`, error);
      }
    }

    return {
      success: true,
    };
  },
};
