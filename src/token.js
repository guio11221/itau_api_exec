const axios = require("axios");
const https = require("https");
const { ResponseError } = require("./class/error");

/**
 * Classe para gerenciar a autenticação e obtenção de tokens OAuth.
 */
class Token {
  /**
     * Cria uma instância da classe Token.
     * @param {Object} chave - Os parâmetros necessários.
     * @param {Object} chave.chave - O objeto que contém as credenciais.
     * @param {string} chave.chave.clientId - Client ID da conta.
     * @param {string} chave.chave.client_secret - Client Secret da conta.
     * @param {string} chave.chave.chave - chave.
     * @param {string} cert - O certificado.
     * @param {string} key - A chave privada.
     */
    constructor({ chave, cert, key }) {
        this.chave = chave; // Armazena o objeto chave com clientId e client_secret
        this.cert = cert; // Certificado para autenticação
        this.key = key; // Chave privada para autenticação
        this.tokenData = null; // Armazena o token obtido
    }

    /**
     * Obtém um token OAuth.
     * @returns {Promise<Object>} Os dados do token obtido.
     */
    async token() {
        try {
            // Realiza a solicitação POST para obter o token
            const { data } = await axios.post(
                "https://sts.itau.com.br/api/oauth/token",
                new URLSearchParams({
                    grant_type: "client_credentials", // Tipo de concessão
                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer", // Tipo de afirmação
                    client_id: this.chave.clientId, // Usando o clientId do objeto chave
                    client_secret: this.chave.client_secret, // Usando o client_secret do objeto chave
                }),
                {
                    httpsAgent: new https.Agent({
                        cert: this.cert, // Certificado
                        key: this.key, // Chave privada
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded", // Tipo de conteúdo da requisição
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
     * Obtém o token armazenado.
     * @returns {Object} O token armazenado.
     */
    getToken() {
        return this.tokenData; // Retorna o token armazenado
    }
}

module.exports = Token; // Exporta a classe Token
