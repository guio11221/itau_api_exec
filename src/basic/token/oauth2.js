const axios = require("axios");
const https = require("https");
const { ResponseError } = require("../../class/error");
const gerarJWT = require("../../models/gerarJWT");
const fs = require("fs");

/**
 * Classe responsável por obter o token OAuth2 usando autenticação JWT.
 */
class TokenAuth2 {
    /**
     * @constructor
     * @param {Object} params - Parâmetros necessários para a autenticação.
     * @param {Object} params.chave - Objeto contendo as credenciais.
     * @param {string} params.chave.clientId - ID do cliente.
     * @param {string} params.chave.client_secret - Segredo do cliente.
     * @param {string} params.cert - Caminho do certificado.
     * @param {string} params.key - Caminho da chave privada.
     */
    constructor({ chave, cert, key }) {
        if (!chave || !chave.clientId || !chave.client_secret) {
            throw new Error("Parâmetros chave, clientId e client_secret são obrigatórios.");
        }

        this.clientId = chave.clientId; // ID do cliente
        this.clientSecret = chave.client_secret; // Segredo do cliente
        this.cert = cert // Carrega o certificado
        this.key = key // Carrega a chave privada
        this.tokenData = null; // Token OAuth2 obtido
    }

    /**
     * Solicita um token OAuth2 ao servidor.
     * @returns {Promise<Object>} Os dados do token obtido.
     */
    async token() {
        try {
            // Gera o JWT para autenticação
            const jwtToken = gerarJWT(this.clientId, this.key);

            // Solicitação POST para obter o token OAuth2
            const { data } = await axios.post(
                "https://sts.itau.com.br/as/token.oauth2",
                new URLSearchParams({
                    grant_type: "urn:ietf:params:oauth:grant-type:client_credentials",
                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                    client_assertion: jwtToken,  
                }).toString(),
                {
                    httpsAgent: new https.Agent({
                        cert: this.cert,
                        key: this.key,
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            this.tokenData = data; // Armazena o token obtido
            return data; // Retorna o token
        } catch (error) {
            throw new ResponseError(401, error.response ? error.response.data : error.message);
        }
    }

    /**
     * Retorna o token OAuth2 armazenado.
     * @returns {Object|null} Dados do token armazenado ou null se não houver.
     */
    getToken() {
        return this.tokenData;
    }
}

module.exports = TokenAuth2;
