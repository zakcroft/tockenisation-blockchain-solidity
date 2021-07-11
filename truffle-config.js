const path = require("path");
require('dotenv').config({path: './.env.local'});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;

//ganache-cli --p 6545 --networkId 1337 --chainId 1337
//truffle migrate --network ganacheCLI
//truffle console --network ganacheCLI

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 6545,
      network_id: "5777"
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ganacheCLI: {
      host: "127.0.0.1",
      port: 6545,
      network_id: "1337"
    },
    ganache_local: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", MetaMaskAccountIndex )
      },
      network_id: 5777
    }
  },
  compilers: {
    solc: {
      version: "0.8.6"
    }
  }
};
