import React from "react";
import Web3 from "web3";

// TODO
//require('dotenv').config({path: './.env.local'});
const useLocal = false;

let p: Promise<Web3>;

const getWeb3 = (): Promise<Web3> => {
  if (!p) {
    p = new Promise<Web3>((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          await window.ethereum.send("eth_requestAccounts");
          window.ethereum.on('chainChanged', () => {
            // Correctly handling chain changes can be complicated.
            // We recommend reloading the page unless you have good reason not to.
            window.location.reload();
          });
          const web3: Web3 = new Web3(window.ethereum);
          resolve(web3);
        } else if (useLocal) {
          const provider = new Web3.providers.HttpProvider(
            "http://localhost:8545"
          );
          const web3: Web3 = new Web3(provider);
          resolve(web3);
        } else {
          reject();
        }
      });
    });
  }
  return p;
};

export default getWeb3;
