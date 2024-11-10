const axios = require('axios');
const https = require('https');

class RequestRouter {
  constructor({ chave, token, cert, key }) {
    if (!token || !cert || !key) {
      throw new Error("Certificado, chave e token são obrigatórios para inicializar a classe RequestRouter.");
    }

    this.baseURL = "https://secure.api.itau/pix_recebimentos/v2";
    this.chave = chave;
    this.token = token;
    this.httpsAgent = new https.Agent({ cert, key });
  }

  async request(method, route, data = {}) {
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${route}`,
        data,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        httpsAgent: this.httpsAgent,
      });
      return response.data;
    } catch (error) {
      // console.error('Erro ao fazer a requisição:', error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : error.message;
    }
  }

  async get(route) {
    return this.request('GET', route);
  }

  async post(route, data) {
    return this.request('POST', route, data);
  }

  async put(route, data) {
    return this.request('PUT', route, data);
  }

  async delete(route) {
    return this.request('DELETE', route);
  }

  async patch(route, data) {
    return this.request('PATCH', route, data);
  }
}

module.exports = RequestRouter;
