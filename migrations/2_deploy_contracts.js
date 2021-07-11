const CappaToken = artifacts.require("./CappaToken");
const CappaTokenSale = artifacts.require("./CappaTokenSale");
const KycContract = artifacts.require("./KycContract");
require("dotenv").config({ path:"../.env.local" });

module.exports = async function(deployer) {
  const addr = await web3.eth.getAccounts();
  await deployer.deploy(CappaToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(KycContract);
  await deployer.deploy(CappaTokenSale, 1, addr[0], CappaToken.address, KycContract.address);
  const instance = await CappaToken.deployed();
  await instance.transfer(CappaTokenSale.address, 1000000);
};

