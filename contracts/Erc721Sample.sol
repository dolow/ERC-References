// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0 <= 0.8.10;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract Erc721Sample is ERC721 {

    uint256 private _currentIncrementalTokenId;

    constructor() ERC721("Nice 721 Token", "N7T") {
        _currentIncrementalTokenId = 0;
    }

    // ERC721 allows managing different NFT ids.
    // owner can own only one token for single token id.
    function mint(address recepiant, uint256 tokenId) public {
        _safeMint(recepiant, tokenId);
        _currentIncrementalTokenId++;
    }

    function tokenExists(uint256 tokenId) public view returns(bool) {
        return _exists(tokenId);
    }

    function nextTokenId() public view returns(uint256) {
        return _currentIncrementalTokenId + 1;
    }

    /*
    function _baseURI() internal view virtual override returns (string memory) {
        return "";
    }
    */
}
