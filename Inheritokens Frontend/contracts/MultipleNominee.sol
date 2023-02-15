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
        address nominee;
        uint share;
    }
    // mapping of owner address to token address to struct
    mapping(address => mapping(address => Multiple[]))
        public ownerToTokenToMultipleStruct;

    /// @param _owner is the address of the owner; _nominee is the address of the nominee; _tokenAddress is
    // the address of the token contract, _tokenName is the name of the token, _share is the amount the owner
    // wants to allocate to the nominee, _isMultipleNominee is the boolean value indicating whether this
    // process of nomination involves multiple nominees or not, _isPriorityNominee is a boolean value
    // that indicates whether or not this nomination process is prioritised in terms of nominees

    /// @notice If the share is allocated to 100%, then the owner will not be able to add more nominees for
    // this token. Either he has to remove or edit any of those nominees.
    function assignTokensToMultipleNominees(
        address _owner,
        address[] memory _nominee,
        address _tokenAddress,
        string memory _tokenName,
        uint[] memory _share
    ) public {
        bool nominated;
        uint _allocateShare;
        (, , _allocateShare, nominated) = inheritokens
            .tokenAddressToTokenStruct(_owner, _tokenAddress);
        if (!nominated) {
            inheritokens.assignTokenStruct(
                _owner,
                _tokenAddress,
                _tokenName,
                _allocateShare
            );
        }
        uint len = ownerToTokenToMultipleStruct[_owner][_tokenAddress].length;
        if (len > 0) {
            delete ownerToTokenToMultipleStruct[_owner][_tokenAddress];
            inheritokens.updateAllocatedShare(_owner, _tokenAddress, 0);
        }
        for (uint i = 0; i < _nominee.length; i++) {
            (, , _allocateShare, nominated) = inheritokens
                .tokenAddressToTokenStruct(_owner, _tokenAddress);
            uint amount = _allocateShare + _share[i];
            require(amount <= 100, "Reduce the share amount...");
            inheritokens.updateAllocatedShare(_owner, _tokenAddress, amount);
            inheritokens.processAfterAssignedMultiple(
                _owner,
                _tokenAddress,
                _nominee,
                i
            );
            ownerToTokenToMultipleStruct[_owner][_tokenAddress].push(
                Multiple(_nominee[i], _share[i])
            );
        }
    }

    /// @param _owner is the address of the owner; _nominee is the address of the nominee; _tokenAddress is the address of the token contract,
    //  _oldShare is the old share of the nominee for a particular token, _share is the amount the owner wants to allocate to the nominee,
    // _isMultipleNominee is the boolean value indicating whether this process of nomination involves multiple nominees or not,
    function editAssignedTokensToMultipleNominees(
        address _owner,
        address[] memory _nominee,
        address _tokenAddress,
        uint[] memory _share
    ) public {
        bool nominated;
        uint _allocateShare;
        (, , _allocateShare, nominated) = inheritokens
            .tokenAddressToTokenStruct(_owner, _tokenAddress);
        require(nominated, "First nominate the Asset!");

        for (uint i = 0; i < _nominee.length; i++) {
            (, , _allocateShare, nominated) = inheritokens
                .tokenAddressToTokenStruct(_owner, _tokenAddress);
            uint amount = _allocateShare + _share[i];
            require(amount <= 100, "Reduce the share amount...");
            inheritokens.updateAllocatedShare(_owner, _tokenAddress, amount);
            inheritokens.processAfterAssignedMultiple(
                _owner,
                _tokenAddress,
                _nominee,
                i
            );
            ownerToTokenToMultipleStruct[_owner][_tokenAddress].push(
                Multiple(_nominee[i], _share[i])
            );
        }
    }

    /// @return uint indicating share allocated to the nominee for a given token
    function getNomineeToTokenShare(
        address _owner,
        address _nominee,
        address _tokenAddress
    ) public view returns (uint) {
        uint share;
        for (
            uint i = 0;
            i < ownerToTokenToMultipleStruct[_owner][_tokenAddress].length;
            i++
        ) {
            if (
                ownerToTokenToMultipleStruct[_owner][_tokenAddress][i]
                    .nominee == _nominee
            ) {
                share = ownerToTokenToMultipleStruct[_owner][_tokenAddress][i]
                    .share;
                break;
            }
        }
        return share;
    }
}
