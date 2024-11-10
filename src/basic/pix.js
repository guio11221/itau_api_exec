const axios = require('axios'); // Importa a biblioteca axios para fazer requisições HTTP
const https = require('https'); // Importa o módulo https para criar agentes HTTPS
const { ResponseError } = require('../class/error');

/**
 * Classe para interagir com a API Pix do Itaú.
 */
class Pix {
    /**
     * Cria uma instância da classe Pix.
     * @param {Object} param - Os parâmetros necessários para a instância.
     * @param {string} [param.chave] - A chave Pix da conta.
     * @param {string} [param.token] - O token de autenticação.
     * @param {string} [param.cert] - O certificado para autenticação.
     * @param {string} [param.key] - A chave privada para autenticação.
     * @throws Will throw an error if required parameters are missing.
     */
    constructor({
        chave,
        token,
        cert,
        key,
    }) {
        // Verifica se os parâmetros obrigatórios estão presentes
        if (!chave || !token || !cert || !key) {
            throw new Error("Parâmetros obrigatórios ausentes: 'chave', 'token', 'cert' e 'key' são necessários.");
        }
        this.baseURL = "https://secure.api.itau/pix_recebimentos/v2"; // Armazena a URL base da API
        this.chave = chave; // Armazena a chave Pix
        this.token = token; // Armazena o token de autenticação
        this.cert = cert; // Armazena o certificado
        this.key = key; // Armazena a chave privada
        this.httpsAgent = this.createHttpsAgent(); // Cria um agente HTTPS para as requisições
    }

    /**
     * Cria um agente HTTPS com o certificado e chave fornecidos.
     * @returns {https.Agent} O agente HTTPS configurado.
     */
    createHttpsAgent() {
        return new https.Agent({
            cert: this.cert, // Define o certificado
            key: this.key, // Define a chave privada
        });
    }

    /**
     * Obtém os cabeçalhos padrão para as requisições.
     * @returns {Object} Os cabeçalhos necessários para a requisição.
     */
    getHeaders() {
        return {
            Accept: "application/json", // Aceita resposta em JSON
            "Content-Type": "application/json", // Tipo de conteúdo das requisições
            Authorization: `Bearer ${this.token}`, // Cabeçalho de autorização com o token
        };
    }

    /**
     * Faz uma requisição HTTP genérica.
     * @param {string} method - O método HTTP (GET, POST, PUT, DELETE).
     * @param {string} route - A rota da API a ser chamada.
     * @param {Object|null} data - Os dados a serem enviados (pode ser null para métodos que não enviam dados).
     * @returns {Promise<Object>} Os dados da resposta da API.
     * @throws Will throw an error if the request fails.
     */
    async request(method, route, data = null) {
        try {
            const response = await axios({
                method: method, // Método da requisição
                url: `${this.baseURL}${route}`, // URL completa da requisição
                data, // Dados a serem enviados
                headers: this.getHeaders(), // Cabeçalhos da requisição
                httpsAgent: this.httpsAgent, // Agente HTTPS
            });
            return response.data; // Retorna os dados da resposta
        } catch (error) {
            // Lança um erro com dados da resposta ou mensagem

            throw new ResponseError(401, error.response ? error.response.data : error.message); // Lança um erro com código 401
          
        }
    }

    /**
     * Faz uma requisição GET.
     * @param {string} route - A rota da API a ser chamada.
     * @returns {Promise<Object>} Os dados da resposta da API.
     */
    async get(route) {
        return this.request('GET', route); // Chama o método request com método GET
    }

    /**
     * Faz uma requisição POST.
     * @param {string} route - A rota da API a ser chamada.
     * @param {Object} data - Os dados a serem enviados na requisição.
     * @returns {Promise<Object>} Os dados da resposta da API.
     */
    async post(route, data) {
        return this.request('POST', route, data); // Chama o método request com método POST
    }

    /**
     * Faz uma requisição PUT.
     * @param {string} route - A rota da API a ser chamada.
     * @param {Object} data - Os dados a serem enviados na requisição.
     * @returns {Promise<Object>} Os dados da resposta da API.
     */
    async put(route, data) {
        return this.request('PUT', route, data); // Chama o método request com método PUT
    }

    /**
     * Faz uma requisição DELETE.
     * @param {string} route - A rota da API a ser chamada.
     * @returns {Promise<Object>} Os dados da resposta da API.
     */
    async delete(route) {
        return this.request('DELETE', route); // Chama o método request com método DELETE
    }
}

module.exports = Pix; // Exporta a classe Pix
