const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // Para gerar o identificador único jti

/**
 * @description Gera o JWT usando a chave privada para autenticação com o OAuth2 do Itaú.
 * @param {string} clientId - O ID do cliente fornecido pelo Itaú.
 * @param {string} privateKey - A chave privada usada para assinar o token.
 * @param {string} kid - Identificador da chave para o cabeçalho do JWT.
 * @param {string} [expiresIn="1h"] - Tempo de expiração do token (opcional, padrão: 1 hora).
 * @returns {string} O token JWT gerado.
 */
function gerarJWT(clientId, privateKey, kid, expiresIn = "1h") {
    if (!clientId) throw new Error("O clientId é obrigatório para gerar o JWT.");
    if (!privateKey) throw new Error("A chave privada (privateKey) é obrigatória para gerar o JWT.");
    if (!kid) throw new Error("O identificador da chave (kid) é obrigatório para o cabeçalho do JWT.");

    // Define as informações do JWT
    const payload = {
        sub: clientId,                        // Identificador da aplicação consumidora
        aud: "id.itau.com.br/as/token.oauth2", // Audience com valor fixo especificado
        iss: clientId,                         // Emissor, geralmente o próprio clientId
        iat: Math.floor(Date.now() / 1000),    // Hora de geração do token
        exp: Math.floor(Date.now() / 1000) + 3600, // Expiração (1 hora após iat)
        jti: uuidv4(),                         // Identificador único do JWT
    };

    // Opções do cabeçalho, incluindo o identificador da chave
    const header = {
        kid,                                   // Identificador da chave
        alg: "RS256",                          // Algoritmo de assinatura fixo
    };

    // Gera o token
    return jwt.sign(payload, privateKey, { algorithm: "RS256", header });
}

module.exports = gerarJWT;
