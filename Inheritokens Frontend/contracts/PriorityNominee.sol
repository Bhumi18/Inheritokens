//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

/// @title Multiple nominee Functionality
/// @author Bhumi Sadariya

import "./Inheritokens.sol";

contract PriorityNominee {
    address public inheritokensAddress;

    constructor(address _inheritokensAddress) {
        inheritokensAddress = _inheritokensAddress;
    }

    Inheritokens inheritokens = Inheritokens(inheritokensAddress);

    // struct for priority nominee
    struct Priority {
        address nominee;
        uint rank;
    }
    // mapping of owner address to token address to struct
    mapping(address => mapping(address => Priority[]))
        public ownerToTokenToPriorityStruct;

    /// @param _owner is the owner's address, _nominee is the nominee's address, _tokenAddress is the address of the token,
    // _tokenName is the name of the token, _isMultipleNominee is the boolean value indicating whether this process of
    // nomination involves multiple nominees or not, _isPriorityNominee is a boolean value that indicates whether or
    // not this nomination process is prioritised in terms of nominees

    function assignedTokensToPriorityNominee(
        address _owner,
        address[] memory _nominee,
        address _tokenAddress,
        string memory _tokenName,
        uint[] memory _rank,
        bool _isMultipleNominee,
        bool _isPriorityNominee
    ) public {
        bool nominated;
        uint _allocateShare;
        (, , _allocateShare, , , nominated) = inheritokens
            .tokenAddressToTokenStruct(_tokenAddress);
        require(!nominated, "Already token is nominated");
        uint amount = 0;
        for (uint i = 0; i < _nominee.length; i++) {
            if (!nominated) {
                inheritokens.pushMultipleNominee(
                    _tokenAddress,
                    _tokenName,
                    amount,
                    _isMultipleNominee,
                    _isPriorityNominee
                );
            }
            ownerToTokenToPriorityStruct[_owner][_tokenAddress].push(
                Priority(_nominee[i], _rank[i])
            );
            inheritokens.processAfterAssignedMultiple(
                _owner,
                _tokenAddress,
                _nominee,
                i
            );
        }
    }

    /// @param _owner is the owner's address, _oldNominee is the current nominee's address, _newNominee is the address
    // of the nominee which owner wants to edit with the current address, _tokenAddress is the address of the token
    function editAssignedTokensToPriorityNominees(
        address _owner,
        address[] memory _nominee,
        address _tokenAddress,
        uint[] memory _rank,
        bool _isPriorityNominee
    ) public {
        bool nominated;
        uint _allocateShare;
        (, , _allocateShare, , , nominated) = inheritokens
            .tokenAddressToTokenStruct(_tokenAddress);
        require(_isPriorityNominee, "It is only for priority nominee");
        require(nominated, "First nominate the Asset!");
        bool flag;
        for (uint i = 0; i < _nominee.length; i++) {
            for (
                uint j = 0;
                j < ownerToTokenToPriorityStruct[_owner][_tokenAddress].length;
                j++
            ) {
                if (
                    ownerToTokenToPriorityStruct[_owner][_tokenAddress][j]
                        .nominee == _nominee[i]
                ) {
                    ownerToTokenToPriorityStruct[_owner][_tokenAddress][j]
                        .rank = _rank[i];
                    flag = true;
                    break;
                } else {
                    ownerToTokenToPriorityStruct[_owner][_tokenAddress][j]
                        .rank = 0;
                }
            }
            if (flag == false) {
                ownerToTokenToPriorityStruct[_owner][_tokenAddress].push(
                    Priority(_nominee[i], _rank[i])
                );
                inheritokens.processAfterAssignedMultiple(
                    _owner,
                    _tokenAddress,
                    _nominee,
                    i
                );
            }
        }
    }

    function getOwnerToTokenAddressToPriorityArray(
        address _owner,
        address _tokenAddress
    ) public view returns (Priority[] memory) {
        return ownerToTokenToPriorityStruct[_owner][_tokenAddress];
    }
}
