const CappaToken = artifacts.require("CappaToken");
const chai = require("./chaisetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("CappaToken Test", async (accounts) => {
  const [initialHolder, recipient, anotherAccount] = accounts;
  let instance;

  beforeEach(async () => {
    instance = await CappaToken.new(process.env.INITIAL_TOKENS);
  });

  it("All tokens should be in my account", async () => {
    let totalSupply = await instance.totalSupply();
    await expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it("Is possible to send tokens between accounts", async () => {
    const sendTokens = 1;
    let totalSupply = await instance.totalSupply();
    await expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
    await expect(instance.transfer(recipient, sendTokens)).to.eventually.be
      .fulfilled;
    await expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
    await expect(
      instance.balanceOf(recipient)
    ).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
  });

  it("It's not possible to send more tokens than account 1 has", async () => {
    let balanceOfAccount = await instance.balanceOf(initialHolder);
    await expect(instance.transfer(recipient, new BN(balanceOfAccount + 1))).to
      .eventually.be.rejected;
    await expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(balanceOfAccount);
  });
});
