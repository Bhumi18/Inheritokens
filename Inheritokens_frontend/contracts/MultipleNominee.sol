//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

/// @title Multiple nominee Functionality
/// @author Bhumi Sadariya

import "./Inheritokens.sol";

contract MultipleNominee {
    address public inheritokensAddress;
    Inheritokens public inheritokens;

    constructor(address _inheritokensAddress) {
        inheritokensAddress = _inheritokensAddress;
        inheritokens = Inheritokens(inheritokensAddress);
    }

    // struct for multiple nominee
    struct Multiple {
        uint share;
        address[] nominee;
        bool[] isNotAvailable; // true means not available and false means available
        bool[] isClaimed; // true means nominee has claimed
    }
    // mapping of owner address to token address to struct
    mapping(address => mapping(address => mapping(uint => Multiple[])))
        public ownerToTokenToMultipleStruct;

    // address[] private temp_nominee;
    // bool[] private temp_availability;

    // event
    event TokensAssigned(
        address indexed _owner,
        address _tokenAddress,
        uint _tokenId
    );

    /// @param _owner is the address of the owner; _nominee is the address of the nominee; _tokenAddress is
    // the address of the token contract, _tokenName is the name of the token, _share is the amount the owner
    // wants to allocate to the nominee, _isMultipleNominee is the boolean value indicating whether this
    // process of nomination involves multiple nominees or not, _isPriorityNominee is a boolean value
    // that indicates whether or not this nomination process is prioritised in terms of nominees

    /// @notice If the share is allocated to 100%, then the owner will not be able to add more nominees for
    // this token. Either he has to remove or edit any of those nominees.
    function assignTokensToMultipleNominees(
        address _tokenAddress,
        string memory _tokenName,
        string memory _category,
        uint _tokenId,
        uint _totalShare,
        Multiple[] memory data
    ) public {
        // modifier remaining
        bool nominated;
        uint _allocateShare;
        (, , , , _allocateShare, nominated) = inheritokens
            .tokenAddressToTokenStruct(msg.sender, _tokenAddress);
            console.log(msg.sender);
        if (!nominated) {
            inheritokens.assignTokenStruct(
                msg.sender,
                _tokenAddress,
                _tokenName,
                _category,
                _allocateShare,
                _tokenId
            );
        }
        uint len = ownerToTokenToMultipleStruct[msg.sender][_tokenAddress][_tokenId]
            .length;
        if (len > 0) {
            delete ownerToTokenToMultipleStruct[msg.sender][_tokenAddress][
                _tokenId
            ];
            inheritokens.updateAllocatedShare(msg.sender, _tokenAddress, 0);
        }
        require(_totalShare <= 100, "Reduce the share amount...");
        inheritokens.updateAllocatedShare(msg.sender, _tokenAddress, _totalShare);
        for (uint i = 0; i < data.length; i++) {
            ownerToTokenToMultipleStruct[msg.sender][_tokenAddress][_tokenId].push(
                data[i]
            );
        }
        emit TokensAssigned(msg.sender, _tokenAddress, _tokenId);
    }

    function getAllStructs(
        address _owner,
        address _tokenAddress,
        uint _tokenId
    ) public view returns (Multiple[] memory) {
        return ownerToTokenToMultipleStruct[_owner][_tokenAddress][_tokenId];
    }

    function getMultipleStruct(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint index
    ) public view returns (Multiple memory) {
        return
            ownerToTokenToMultipleStruct[_owner][_tokenAddress][_tokenId][
                index
            ];
    }
}
