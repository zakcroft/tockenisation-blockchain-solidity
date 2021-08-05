import React, { Component } from "react";
import "./App.css";
import { OnboardingButton } from "./components/metamaskOnboarding";
import Web3 from "web3";
import getWeb3 from "./getWeb3";

// Must use require
//https://ethereum.stackexchange.com/questions/94601/trouble-with-web3-eth-contract-abi-usage-with-typescript
const CappaToken = require("./contracts/CappaToken.json");
const CappaTokenSale = require("./contracts/CappaTokenSale.json");
const KycContract = require("./contracts/KycContract.json");

interface s {
  web3?: Web3;
  accounts: string[] | undefined;
  networkId: number | undefined;
  loaded: boolean;
  kycAddress: string;
  tokenSaleAddress: string;
  myToken?: any;
  myTokenSale?: any;
  kycContract?: any;
  userTokens?: number;
  loadInstallMetaMask?: boolean;
}

class App extends Component<{}, s> {
  state: s = {
    loaded: false,
    kycAddress: "0x123",
    tokenSaleAddress: "",
    accounts: [],
    networkId: 5, //goerli,
    loadInstallMetaMask: false,
  };

  loadContracts = async (web3: Web3) => {
    const { eth } = web3;
    const accounts = await eth.getAccounts();
    //this.networkId = await this.web3.eth.net.getId(); <<- this doesn't work with MetaMask anymore
    const networkId = await eth.getChainId();

    const myToken = new eth.Contract(
      CappaToken.abi,
      CappaToken.networks[networkId]?.address
    );
    const myTokenSale = new eth.Contract(
      CappaTokenSale.abi,
      CappaTokenSale.networks[networkId]?.address
    );
    const kycContract = new eth.Contract(
      KycContract.abi,
      KycContract.networks[networkId]?.address
    );

    // console.log("networkId ===", networkId);
    // console.log("accounts ===", accounts);
    // console.log("myToken ===", myToken);
    // console.log("myTokenSale ===", myTokenSale);
    // console.log("kycContract ===", kycContract);
    // console.log(
    //   "CappaToken.networks[networkId]?.address ===",
    //   CappaToken.networks[networkId]?.address
    // );
    // console.log(
    //   "CappaTokenSale.networks[networkId]?.address ===",
    //   CappaTokenSale.networks[networkId]?.address
    // );
    // console.log(
    //   "KycContract.networks[networkId]?.address ===",
    //   KycContract.networks[networkId]?.address
    // );

    this.setState(
      {
        loaded: true,
        tokenSaleAddress: myTokenSale.options.address,
        web3,
        accounts,
        networkId,
        myToken,
        myTokenSale,
        kycContract,
      },
      async () => {
        await this.updateUserTokens();
        await this.listenToTokenTransfer();
      }
    );
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      web3.eth.net.getNetworkType().then(async (netId) => {
        if(netId !== "goerli"){
          // contracts only on Goerli
          alert("Change to network Goerli in wallet")
        } else {
          await this.loadContracts(web3);
        }
      });
    } catch (e) {
      // no web3 object so load install a wallet.
      this.setState({ loadInstallMetaMask: true });
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState<any>({
      [name]: value,
    });
  };

  handleKycSubmit = async () => {
    const { kycContract, kycAddress, accounts } = this.state;
    await kycContract.methods
      .setKycCompleted(kycAddress)
      .send({ from: accounts?.[0] });
    alert("Account " + kycAddress + " is now whitelisted");
  };

  handleBuyToken = async () => {
    const { myTokenSale, accounts } = this.state;
    await myTokenSale.methods
      .buyTokens(accounts?.[0])
      .send({ from: accounts?.[0], value: 1 });
  };

  updateUserTokens = async () => {
    const { myToken, accounts } = this.state;
    let userTokens = accounts?.length
      ? await myToken.methods.balanceOf(accounts?.[0]).call()
      : null;
    this.setState({ userTokens: userTokens });
  };

  listenToTokenTransfer = async () => {
    const { myToken, accounts } = this.state;
    myToken.events
      .Transfer({ to: accounts?.[0] })
      .on("data", this.updateUserTokens);
  };

  render() {
    const {
      loaded,
      kycAddress,
      tokenSaleAddress,
      userTokens,
      loadInstallMetaMask,
    } = this.state;

    if (loadInstallMetaMask) {
      return <OnboardingButton />;
    }
    if (!loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Capuccino Token for StarDucks</h1>
        <h2>Enable your account</h2>
        Address to allow:{" "}
        <input
          type="text"
          name="kycAddress"
          value={kycAddress}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleKycSubmit}>
          Add Address to Whitelist
        </button>
        <h2>Buy Cappucino-Tokens</h2>
        <p>Send Ether to this address: {tokenSaleAddress}</p>
        <p>You have: {userTokens}</p>
        <button type="button" onClick={this.handleBuyToken}>
          Buy more tokens
        </button>
      </div>
    );
  }
}

export default App;
