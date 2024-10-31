/**
 * Classe para representar um erro de resposta.
 * Estende a classe nativa Error.
 */
class ResponseError extends Error {
  /**
   * Cria uma instância de ResponseError.
   * @param {number} code - O código do erro.
   * @param {Object} error - O objeto de erro que contém detalhes adicionais.
   */
  constructor(code, error) {
      super(error.message); // Chama o construtor da classe pai com a mensagem de erro
      this.name = this.constructor.name; // Define o nome do erro como o nome da classe
      this.code = code; // Armazena o código do erro
      this.status = 401; // Define o status HTTP padrão (pode ser alterado conforme necessário)
      this.details = error; // Armazena detalhes adicionais do erro
  }
}

/**
* Classe para representar uma resposta de erro genérica.
* Estende a classe nativa Error.
*/
class ErrorResponse extends Error {
  /** 
   * Cria uma instância de ErrorResponse.
   * @param {number} code - O código do erro.
   * @param {string} message - A mensagem de erro.
   */
  constructor(code, message) {
      super(message); // Chama o construtor da classe pai com a mensagem de erro
      this.name = this.constructor.name; // Define o nome do erro como o nome da classe
      this.code = code; // Armazena o código do erro
  }
}

// Exporta as classes ResponseError e ErrorResponse
module.exports = { ResponseError, ErrorResponse };
