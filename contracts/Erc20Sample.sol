// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0 <= 0.8.10;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Erc20Sample is ERC20 {

    constructor() ERC20("Nice Token", "NT") {
        _mint(msg.sender, 100 * 10**uint(decimals()));
    }

    // a.k.a faucet, it just bridges to _mint method which provided by openzeppelin impl
    function freeMint(address recepiant, uint amount) public {
        _mint(recepiant, amount * 10**uint(decimals()));
    }
}
