// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./Crowdsale.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./KycContract.sol";

contract CappaTokenSale is Crowdsale {
    KycContract kyc;

    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    ) Crowdsale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(
            kyc.kycCompleted(beneficiary),
            "KYC not completed yet, aborting"
        );
    }
}
