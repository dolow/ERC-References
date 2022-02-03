// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0 <= 0.8.10;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract Erc721Sample is ERC721 {
    // this NFT id is incremental
    uint256 private _currentIncrementalTokenId;

    // experiment
    mapping(uint256 => string) private _uris;

    constructor() ERC721("Nice 721 Token", "N7T") {
        _currentIncrementalTokenId = 0;
    }

    // ERC721 allows managing different NFT ids.
    // owner can own only one token for single token id.
    function mint(address recepiant, uint256 tokenId) public {
        mint(recepiant, tokenId, "");
    }
    function mint(address recepiant, uint256 tokenId, string memory uri) public {
        _safeMint(recepiant, tokenId);
        _uris[tokenId] = uri;
        _currentIncrementalTokenId++;
    }

    function tokenExists(uint256 tokenId) public view returns(bool) {
        return _exists(tokenId);
    }

    function nextTokenId() public view returns(uint256) {
        return _currentIncrementalTokenId + 1;
    }

    // Erc721 provides _baseURI() as virtual method.
    // This sample breaks fixed uri and enabled to bind urls to each token.
    function getTokenUri(uint256 tokenId) public view returns(string memory) {
        require(_exists(tokenId), "Erc721Sample: require registered token id");
        return _uris[tokenId];
    }

    /*
    function _baseURI() internal view virtual override returns (string memory) {
        return "";
    }
    */
}
