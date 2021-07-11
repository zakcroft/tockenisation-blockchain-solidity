const CappaToken = artifacts.require("CappaToken");
const CappaTokenSale = artifacts.require("CappaTokenSale");
const KycContract = artifacts.require("KycContract");

const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("CappaTokenSale Test", async (accounts) => {
  const [initialHolder, recipient, anotherAccount] = accounts;

  it("there shouldnt be any coins in my account", async () => {
    const instance = await CappaToken.deployed();
    return expect(
      instance.balanceOf.call(initialHolder)
    ).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  it("all coins should be in the tokensale smart contract", async () => {
    const instance = await CappaToken.deployed();
    const balance = await instance.balanceOf.call(CappaTokenSale.address);
    const totalSupply = await instance.totalSupply.call();
    return expect(balance).to.be.a.bignumber.equal(totalSupply);
  });

  it("should be possible to buy one token by simply sending ether to the smart contract", async () => {
    const tokenInstance = await CappaToken.deployed();
    const tokenSaleInstance = await CappaTokenSale.deployed();
    const balanceBeforeAccount = await tokenInstance.balanceOf.call(recipient);
    await expect(
      tokenSaleInstance.sendTransaction({
        from: recipient,
        value: web3.utils.toWei("1", "wei"),
      })
    ).to.be.rejected;
    await expect(balanceBeforeAccount).to.be.bignumber.equal(
      await tokenInstance.balanceOf.call(recipient)
    );

    const kycContract = await KycContract.deployed();
    await kycContract.setKycCompleted(recipient);

    await expect(
      tokenSaleInstance.sendTransaction({
        from: recipient,
        value: web3.utils.toWei("1", "wei"),
      })
    ).to.be.fulfilled;
    return expect(balanceBeforeAccount + 1).to.be.bignumber.equal(
      await tokenInstance.balanceOf.call(recipient)
    );
  });
});
