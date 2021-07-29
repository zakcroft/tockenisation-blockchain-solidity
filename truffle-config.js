const path = require("path");
require('dotenv').config({path: './.env.local'});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0;

//ganache-cli --p 6545 --networkId 1337 --chainId 1337
//truffle migrate --network ganacheCLI
//truffle console --network ganacheCLI

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    ganacheCLI: {
      host: "127.0.0.1",
      port: 6545,
      network_id: "1337",
      provider: () => new HDWalletProvider({
          mnemonic: {
            phrase:process.env.MNEMONIC
          },
          providerOrUrl:"http://127.0.0.1:6545",
          numberOfAddresses: 5
        })
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.GOERLI_API_KEY, AccountIndex)
      },
      network_id: 5
    },
    ropsten_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, process.env.ROPSTEN_API_KEY, AccountIndex)
      },
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "0.8.6"
    }
  }
};
