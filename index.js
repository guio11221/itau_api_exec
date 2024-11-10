'use strict';

const Pix = require("./src/basic/pix");
const RequestRouter = require("./src/basic/requestRouter");
const tokenAuth0 = require('./src/basic/token/oauth0');
const tokenAuth2 = require('./src/basic/token/oauth2');

const exportsObject = {
  Pix,
  tokenAuth0,
  tokenAuth2,
  RequestRouter,
};

// Exportando múltiplas referências, eliminando redundância
module.exports = exportsObject;
module.exports.default = exportsObject;
module.exports.mde = exportsObject;
