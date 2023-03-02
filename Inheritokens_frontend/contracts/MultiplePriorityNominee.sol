//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

/// @title Multiple nominee and Priority nominee Functionality
/// @author Bhumi Sadariya

import "./Inheritokens.sol";

contract MultiplePriorityNominee {
    address public inheritokensAddress;
    Inheritokens public inheritokens;

    constructor(address _inheritokensAddress) {
        inheritokensAddress = _inheritokensAddress;
        inheritokens = Inheritokens(inheritokensAddress);
    }

    // structure for multiple and Priority nominee
    struct MultiplePriority {
        uint share;
        address[] nominee;
        bool[] isNotAvailable; // true means not available and false means available
        bool[] isClaimed; // true means nominee has claimed
    }
    // mapping of owner address to token address to structure
    mapping(address => mapping(address => MultiplePriority[]))
        public ownerToTokenToStruct;

    // mapping of owner address to NFT to struct
    mapping(address => mapping(address => mapping(uint => MultiplePriority[])))
        public ownerToNFTToStruct;

    // event
    event TokensAssigned(
        address indexed _owner,
        address _tokenAddress,
        uint _tokenId
    );

    /// @param _tokenAddress is the address of the token contract, _tokenName is the name of the token, _category is the integer
    // indecating 0 for token and 1 for nft, _tokenId is the id of the nft, data is the array of MultiplePriority sturucture
    /// @notice If the share is allocated to 100%, then the owner will not be able to add more nominees for
    // this token. Either he has to remove or edit any of those nominees.
    function assignTokensToMultipleNominees(
        address _tokenAddress,
        string memory _tokenName,
        uint _category,
        uint _tokenId,
        MultiplePriority[] memory data
    ) public {
        // modifier remaining

        // get data of whether token is nominated at least once
        bool nominated;
        (, , , , , nominated) = inheritokens.tokenAddressToTokenStruct(
            msg.sender,
            _tokenAddress
        );

        // calculate total share by looping over data
        uint totalShare;
        for (uint i = 0; i < data.length; i++) {
            totalShare += data[i].share;
        }

        // proceed only if the total share is less than 100
        require(totalShare <= 100, "Reduce the share amount...");
        // if token is not nominated at least for once then assign data to Token struct of inheritokens contract
        if (!nominated) {
            inheritokens.assignTokenStruct(
                msg.sender,
                _tokenAddress,
                _tokenName,
                _category,
                totalShare,
                _tokenId
            );
        }

        // if token is already assigned then delete the data
        uint len;
        if (_category == 0) {
            len = ownerToTokenToStruct[msg.sender][_tokenAddress].length;
            if (len > 0) {
                delete ownerToTokenToStruct[msg.sender][_tokenAddress];
            }
        } else {
            len = ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId]
                .length;
            if (len > 0) {
                delete ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId];
            }
        }
        inheritokens.updateAllocatedShare(
            msg.sender,
            _tokenAddress,
            _tokenId,
            totalShare,
            _category
        );

        // assign data to the Multiple struct
        if (_category == 0) {
            for (uint i = 0; i < data.length; i++) {
                ownerToTokenToStruct[msg.sender][_tokenAddress].push(data[i]);
            }
        } else {
            for (uint i = 0; i < data.length; i++) {
                ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId].push(
                    data[i]
                );
            }
        }
        emit TokensAssigned(msg.sender, _tokenAddress, _tokenId);
    }

    /// @param _owner is the address of the owner, _tokenAddress is the addresss of the token contract, _tokenId is the id
    // of the nft, _category is integer displaying 0 for token and 1 for nft
    function getAllStructs(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _category
    ) public view returns (MultiplePriority[] memory) {
        if (_category == 0) {
            return ownerToTokenToStruct[_owner][_tokenAddress];
        } else {
            return ownerToNFTToStruct[_owner][_tokenAddress][_tokenId];
        }
    }
}
