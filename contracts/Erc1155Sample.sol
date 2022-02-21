// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0 <= 0.8.10;

import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";

contract Erc1155Sample is ERC1155 {
    // this token id is incremental
    uint256 private _currentIncrementalTokenId;

    constructor() ERC1155("https://dolow.github.io/nft/") {
    }

    function mintBatch(address to, uint256[] memory tokenIds, uint256[] memory amounts) public {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(tokenIds[i] <= _currentIncrementalTokenId, "not issued token id is passed");
        }
        _mintBatch(to, tokenIds, amounts, "");
    }

    function newMintBatch(address[] memory recipients, uint256[] memory amounts) public {
        require(recipients.length == amounts.length, "length of recipients and amounts must be the same");
        
        uint256 id = nextTokenId();

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], id, amounts[i], "");
        }

        _currentIncrementalTokenId++;
    }

    function mintBatchAddress(address[] memory recipients, uint256[][] memory tokenIds, uint256[][] memory amounts) public {
        _mintBatchAddress(recipients, tokenIds, amounts);
    }

    // should consider burned token id
    function tokenExists(uint256 tokenId) public view returns(bool) {
        return tokenId < nextTokenId();
    }

    function nextTokenId() public view returns(uint256) {
        return _currentIncrementalTokenId + 1;
    }

    function _mintBatchAddress(
        address[] memory recipients,
        uint256[][] memory ids,
        uint256[][] memory amounts
    ) internal virtual {
        for (uint256 i = 0; i < recipients.length; i++) {
            _mintBatch(recipients[i], ids[i], amounts[i], "");
        }
    }
}
