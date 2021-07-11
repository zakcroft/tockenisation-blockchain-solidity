import React, { Component } from "react";
import CappaToken from "./contracts/CappaToken.json";
import CappaTokenSale from "./contracts/CappaTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "0x123" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      //this.networkId = await this.web3.eth.net.getId(); <<- this doesn't work with MetaMask anymore

      //      console.log("this.networkId",    this.networkId);

      this.networkId = await this.web3.eth.getChainId();

      this.myToken = new this.web3.eth.Contract(
        CappaToken.abi,
        CappaToken.networks[this.networkId] &&
          CappaToken.networks[this.networkId].address
      );

      this.myTokenSale = new this.web3.eth.Contract(
        CappaTokenSale.abi,
        CappaTokenSale.networks[this.networkId] &&
          CappaTokenSale.networks[this.networkId].address
      );
      this.kycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] &&
          KycContract.networks[this.networkId].address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleKycSubmit = async () => {
    const { kycAddress } = this.state;
    await this.kycContract.methods
      .setKycCompleted(kycAddress)
      .send({ from: this.accounts[0] });
    alert("Account " + kycAddress + " is now whitelisted");
  };

  render() {
    if (!this.state.loaded) {
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
          value={this.state.kycAddress}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleKycSubmit}>
          Add Address to Whitelist
        </button>
      </div>
    );
  }
}

export default App;
