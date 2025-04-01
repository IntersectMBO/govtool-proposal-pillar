const axios = require('axios');

module.exports = {
  async fetchData(ctx) {
    try {
      const baseUrl = process.env.GOVTOOL_API_BASE_URL;

      // Uzmite endpoint iz query parametara
      const { endpoint } = ctx.request.query;

      if (!endpoint) {
        return ctx.throw(400, 'Endpoint parametar je obavezan');
      }

      // Spojite base URL i endpoint
      const fullUrl = `${baseUrl}/${endpoint}`;
console.log(fullUrl);
      // Provera da li je URL validan (opciono)
      try {
        new URL(fullUrl); // Provera da li je URL validan
      } catch (error) {
        return ctx.throw(400, 'Nevalidan URL');
      }

      // Pozovite eksterni API
      const response = await axios.get(fullUrl);

      // Vratite podatke klijentu
      ctx.send(response.data);
    } catch (error) {
      ctx.throw(500, 'Greška pri preuzimanju podataka sa eksternog API-ja', { error });
    }
  },
};