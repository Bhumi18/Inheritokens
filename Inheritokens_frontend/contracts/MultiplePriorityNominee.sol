//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";

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
    event Claimed(
        address indexed _owner,
        address indexed _nominee,
        address indexed _tokenAddress,
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
        // owner should be added, and email should be verified
        bool isAdded = inheritokens.checkOwnerAdded(msg.sender);
        bool isVerified = inheritokens.checkEmailVerified(msg.sender);
        require(isAdded, "First register yourself!");
        require(isVerified, "First verify your email");

        // check passed nominees in data are added
        address[] memory nominees = inheritokens.getAllNomineesOfOwner(
            msg.sender
        );
        bool flag;
        for (uint i = 0; i < data.length; i++) {
            for (uint k = 0; k < data[i].nominee.length; k++) {
                flag = false;
                for (uint j = 0; j < nominees.length; j++) {
                    console.log(nominees[j]);
                    if (data[i].nominee[k] == nominees[j]) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false) {
                    revert(
                        "check all the nominees you are entering are added."
                    );
                }
            }
        }

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

    // claim
    /// @param _owner is the owner's address, _tokenAddress is the address of the token, _amount is the amount of the ERC20,
    // _tokenId is the token Id of the asset
    function claim(
        address _owner,
        address _tokenAddress,
        uint _amount,
        uint _tokenId,
        uint _category
    ) public {
        address[] memory nominees = inheritokens.getAllNomineesOfOwner(_owner);
        for (uint i = 0; i < nominees.length; i++) {
            if (nominees[i] == msg.sender) {
                // transfer logic
                if (_category == 0) {
                    IERC20 _token = IERC20(_tokenAddress);
                    _token.transferFrom(_owner, msg.sender, _amount);
                    for (
                        uint k = 0;
                        k < ownerToTokenToStruct[_owner][_tokenAddress].length;
                        k++
                    ) {
                        for (
                            uint j = 0;
                            j <
                            (
                                ownerToTokenToStruct[_owner][_tokenAddress][k]
                                    .nominee
                            ).length;
                            j++
                        ) {
                            if (
                                ownerToTokenToStruct[_owner][_tokenAddress][k]
                                    .nominee[j] == nominees[i]
                            ) {
                                ownerToTokenToStruct[_owner][_tokenAddress][k]
                                    .isClaimed[j] = true;
                                break;
                            }
                        }
                    }
                } else if (_tokenId > 0) {
                    IERC721 _token = IERC721(_tokenAddress);
                    _token.transferFrom(_owner, msg.sender, _tokenId);
                    for (
                        uint k = 0;
                        k < ownerToTokenToStruct[_owner][_tokenAddress].length;
                        k++
                    ) {
                        for (
                            uint j = 0;
                            j <
                            (
                                ownerToNFTToStruct[_owner][_tokenAddress][
                                    _tokenId
                                ][k].nominee
                            ).length;
                            j++
                        ) {
                            if (
                                ownerToNFTToStruct[_owner][_tokenAddress][
                                    _tokenId
                                ][k].nominee[j] == nominees[i]
                            ) {
                                ownerToNFTToStruct[_owner][_tokenAddress][
                                    _tokenId
                                ][k].isClaimed[j] = true;
                                break;
                            }
                        }
                    }
                }
            }
            emit Claimed(_owner, msg.sender, _tokenAddress, _tokenId);
        }
    }
}
