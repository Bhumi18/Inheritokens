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
        uint[] memory _share,
        bool _isMultipleNominee,
        bool _isPriorityNominee
    ) public {
        bool nominated;
        uint _allocateShare;
        (, , _allocateShare, , , nominated) = inheritokens
            .tokenAddressToTokenStruct(_tokenAddress);
        require(!nominated, "Already token is nominated");
        for (uint i = 0; i < _nominee.length; i++) {
            (, , _allocateShare, , , nominated) = inheritokens
                .tokenAddressToTokenStruct(_tokenAddress);
            uint amount = _allocateShare + _share[i];
            require(amount <= 100, "Reduce the share amount...");
            if (!nominated) {
                inheritokens.pushMultipleNominee(
                    _tokenAddress,
                    _tokenName,
                    amount,
                    _isMultipleNominee,
                    _isPriorityNominee
                );
            }
            inheritokens.updateAllocatedShare(_tokenAddress, amount);
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
        uint[] memory _share,
        bool _isMultipleNominee
    ) public {
        delete ownerToTokenToMultipleStruct[_owner][_tokenAddress];

        // bool nominated;
        // uint _allocateShare;
        // (, , _allocateShare, , , nominated) = inheritokens
        //     .tokenAddressToTokenStruct(_tokenAddress);
        // require(_isMultipleNominee, "It is only for multiple nominee");
        // require(nominated, "First nominate the Asset!");
        // inheritokens.processEditForMultiple(_tokenAddress, 0);
        // bool flag;
        // for (uint i = 0; i < _nominee.length; i++) {
        //     for (
        //         uint j = 0;
        //         j < ownerToTokenToMultipleStruct[_owner][_tokenAddress].length;
        //         j++
        //     ) {
        //         if (
        //             ownerToTokenToMultipleStruct[_owner][_tokenAddress][j]
        //                 .nominee == _nominee[i]
        //         ) {
        //             (, , _allocateShare, , , nominated) = inheritokens
        //                 .tokenAddressToTokenStruct(_tokenAddress);
        //             uint amount = _allocateShare + _share[i];
        //             console.log(amount);
        //             require(
        //                 amount <= 100,
        //                 "100% share is already allocated..."
        //             );
        //             ownerToTokenToMultipleStruct[_owner][_tokenAddress][j]
        //                 .share = _share[i];
        //             console.log(
        //                 ownerToTokenToMultipleStruct[_owner][_tokenAddress][j]
        //                     .share
        //             );
        //             inheritokens.processEditForMultiple(_tokenAddress, amount);
        //             flag = true;
        //             break;
        //         } else {
        //             ownerToTokenToMultipleStruct[_owner][_tokenAddress][j]
        //                 .share = 0;
        //         }
        //     }
        //     if (flag == false) {
        //         uint amount = _allocateShare + _share[i];
        //         require(
        //             amount <= 100,
        //             "100% share is already allocated........."
        //         );
        //         ownerToTokenToMultipleStruct[_owner][_tokenAddress].push(
        //             Multiple(_nominee[i], _share[i])
        //         );
        //         inheritokens.processEditForMultiple(_tokenAddress, amount);
        //         inheritokens.processAfterAssignedMultiple(
        //             _owner,
        //             _tokenAddress,
        //             _nominee,
        //             i
        //         );
        //     }
        // }
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
