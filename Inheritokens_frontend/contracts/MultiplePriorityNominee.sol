//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title Multiple nominee and Priority nominee Functionality
/// @author Bhumi Sadariya

import "./Inheritokens.sol";
import "./Charity.sol";

contract MultiplePriorityNominee is Ownable {
    Inheritokens public inheritokens;
    CharityContract public charityContract;
    uint public tokenCharge = 1000000;
    uint public nftCharge = 5000000;
    uint public percentage = 1;
    address public chargeTokenAddress =
        0xe9DcE89B076BA6107Bb64EF30678efec11939234; // USDC

    constructor(
        address _inheritokensAddress,
        address _charityContractAddress
    ) Ownable() {
        inheritokens = Inheritokens(_inheritokensAddress);
        charityContract = CharityContract(_charityContractAddress);
    }

    // structure for multiple and Priority nominee
    struct MultiplePriority {
        uint share;
        address charityAddress;
        address canClaim;
        address[] nominee;
        bool isClaimed;
        string claimingDate;
    }
    // mapping of owner address to token address to structure
    mapping(address => mapping(address => MultiplePriority[]))
        public ownerToTokenToStruct;
    // mapping of owner address to token address to final balance
    mapping(address => mapping(address => uint)) public totalAmount;
    // mapping of owner address to token address to bool
    mapping(address => mapping(address => bool)) public notFirst;

    // mapping of owner address to NFT to struct
    mapping(address => mapping(address => mapping(uint => MultiplePriority[])))
        public ownerToNFTToStruct;

    // event
    // event TokensAssigned(
    //     address indexed _owner,
    //     address _tokenAddress,
    //     uint _tokenId,
    //     uint _category
    // );
    event Claimed(
        address indexed _owner,
        address indexed _nominee,
        address indexed _tokenAddress,
        uint _tokenId,
        uint _amount,
        uint _category
    );
    event Recovered(
        address indexed _owner,
        address indexed _tokenAddress,
        uint _tokenId,
        uint _amount,
        uint _category
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
        require(
            inheritokens.checkOwnerAdded(msg.sender),
            "You must first sign up for an account."
        );
        require(
            inheritokens.checkEmailVerified(msg.sender),
            "Your email has not yet been validated."
        );

        // check passed nominees in data are added
        address[] memory nominees = inheritokens.getAllNomineesOfOwner(
            msg.sender
        );
        bool flag;
        uint[] memory listedCharities = inheritokens.getWhiteListedCharities(
            msg.sender
        );
        bool hasFlag;
        for (uint i = 0; i < data.length; i++) {
            for (uint k = 0; k < data[i].nominee.length; k++) {
                flag = false;
                for (uint j = 0; j < nominees.length; j++) {
                    if (data[i].nominee[k] == nominees[j]) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false) {
                    revert("Oops! nominees is not added!");
                }
            }
            for (uint j = 0; j < listedCharities.length; j++) {
                address _charityAddress;
                (, _charityAddress, , , ) = charityContract.idToCharity(
                    listedCharities[j]
                );
                if (data[i].charityAddress == _charityAddress) {
                    hasFlag = true;
                    break;
                }
            }
            if (hasFlag == false) {
                revert("Oops! charity is not white-listed.");
            }
        }

        // get data of whether token is nominated at least once
        bool nominated;

        if (_category == 0) {
            (, , , , , nominated) = inheritokens.tokenAddressToTokenStruct(
                msg.sender,
                _tokenAddress
            );
        } else if (_category == 1) {
            (, , , , , nominated) = inheritokens.nftAddressToTokenStruct(
                msg.sender,
                _tokenAddress,
                _tokenId
            );
        }

        // calculate total share by looping over data
        uint totalShare;
        for (uint i = 0; i < data.length; i++) {
            totalShare += data[i].share;
        }

        // proceed only if the total share is less than 100
        require(totalShare <= 100, "Oops! You can only allocate a 100% share.");
        // if token is not nominated at least for once then assign data to Token struct of inheritokens contract
        if (!nominated) {
            inheritokens.assignTokenStruct(
                msg.sender,
                _tokenAddress,
                _tokenName,
                _category,
                _tokenId,
                totalShare
            );
        } else {
            IERC20 _token = IERC20(chargeTokenAddress);
            if (_category == 0) {
                require(
                    _token.allowance(msg.sender, address(this)) >= tokenCharge,
                    "allowance is not enough!"
                );
                _token.transferFrom(msg.sender, address(this), tokenCharge);
                delete ownerToTokenToStruct[msg.sender][_tokenAddress];
                for (uint i = 0; i < data.length; i++) {
                    ownerToTokenToStruct[msg.sender][_tokenAddress].push(
                        data[i]
                    );
                }
            } else if (_category == 1) {
                require(
                    _token.allowance(msg.sender, address(this)) >= nftCharge,
                    "allowance is not enough!"
                );
                _token.transferFrom(msg.sender, address(this), nftCharge);
                delete ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId];
                for (uint i = 0; i < data.length; i++) {
                    ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId]
                        .push(data[i]);
                }
            } else {
                revert("category is not matching.");
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
        // if (_category == 0) {
        //     for (uint i = 0; i < data.length; i++) {
        //         ownerToTokenToStruct[msg.sender][_tokenAddress].push(data[i]);
        //     }
        // } else if (_category == 1) {
        //     for (uint i = 0; i < data.length; i++) {
        //         ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId].push(
        //             data[i]
        //         );
        //     }
        // }

        // emit TokensAssigned(msg.sender, _tokenAddress, _tokenId, _category);
    }

    // claim
    /// @param _owner is the owner's address, _tokenAddress is the address of the token, _amount is the amount of the ERC20,
    // _tokenId is the token Id of the asset
    function claim(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _category
    ) public {
        require(inheritokens.getIsClaimable(_owner), "claim is not allowed.");
        // address[] memory nominees = inheritokens.getAllNomineesOfOwner(_owner);
        uint transferToNominee;
        bool flag;
        if (_category == 0) {
            for (
                uint i = 0;
                i < ownerToTokenToStruct[_owner][_tokenAddress].length;
                i++
            ) {
                if (
                    ownerToTokenToStruct[_owner][_tokenAddress][i].canClaim ==
                    msg.sender &&
                    ownerToTokenToStruct[_owner][_tokenAddress][i].isClaimed ==
                    false
                ) {
                    uint _share = ownerToTokenToStruct[_owner][_tokenAddress][i]
                        .share;
                    // function call
                    tokenTransferLogic(_owner, _tokenAddress, _share);

                    //------------------------------------------------------------------------
                    ownerToTokenToStruct[_owner][_tokenAddress][i]
                        .isClaimed = true;
                    flag = true;
                }
            }
            if (flag == false) {
                revert("claim is not allowed.");
            }
        } else if (_category == 1) {
            for (
                uint i = 0;
                i < ownerToNFTToStruct[_owner][_tokenAddress][_tokenId].length;
                i++
            ) {
                if (
                    ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][i]
                        .canClaim ==
                    msg.sender &&
                    ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][i]
                        .isClaimed ==
                    false
                ) {
                    // function call
                    nftTransferLogic(_owner, _tokenAddress, _tokenId);

                    ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][i]
                        .isClaimed = true;
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                revert("claim is not allowed.");
            }
        }
        emit Claimed(
            _owner,
            msg.sender,
            _tokenAddress,
            _tokenId,
            transferToNominee,
            _category
        );
    }

    function tokenTransferLogic(
        address _owner,
        address _tokenAddress,
        uint _share
    ) public {
        IERC20 _token = IERC20(_tokenAddress);

        if (!notFirst[_owner][_tokenAddress]) {
            totalAmount[_owner][_tokenAddress] = _token.balanceOf(_owner);
            notFirst[_owner][_tokenAddress] = true;
        }
        // uint _totalToken = _token.balanceOf(_owner);
        uint _finalAmount = (totalAmount[_owner][_tokenAddress] * _share) / 100;
        // contract charge
        uint transferToContract = (_finalAmount * percentage) / (10000);

        // value msg.sender will get
        uint transferToCaller = (_finalAmount - transferToContract);

        // to contract
        _token.transferFrom(_owner, address(this), transferToContract);

        // to caller
        _token.transferFrom(_owner, msg.sender, transferToCaller);
    }

    function nftTransferLogic(
        address _owner,
        address _tokenAddress,
        uint _tokenId
    ) public {
        IERC721 _nft = IERC721(_tokenAddress);
        // transfer to charity
        _nft.transferFrom(_owner, msg.sender, _tokenId);
    }

    // recovery claim
    /// @param _owner is the owner's address, _tokenAddress is the address of the token, _amount is the amount of the ERC20,
    // _tokenId is the token Id of the asset
    function recoveryClaim(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _category
    ) public {
        // transfer logic
        // fot tokens
        // check the user who is calling the function has the address same as recovery address of the owner
        require(
            inheritokens.getOwnerDetails(_owner).recoveryAddress == msg.sender,
            "The recovery address or owner address is incorrect!"
        );
        require(
            !(inheritokens.getIsClaimable(_owner)),
            "Your assets are already claimed by the nominee."
        );
        uint _totalToken;
        if (_category == 0) {
            tokenTransferLogic(_owner, _tokenAddress, 100);
        } else if (_tokenId > 0) {
            nftTransferLogic(_owner, _tokenAddress, _tokenId);
        }
        emit Recovered(_owner, _tokenAddress, _tokenId, _totalToken, _category);
    }

    /// @notice _amount should be multiple with the decimals according to the token
    /// @param _amount is the value for a specific token admin wants to withdraw from the contract, _tokenAddress is the address
    // of the token
    function withdrawFromContract(
        uint _amount,
        address _tokenAddress
    ) public payable onlyOwner {
        IERC20 _token = IERC20(_tokenAddress);
        _token.transfer(msg.sender, _amount);
    }

    /// @notice this function is to change the token we charge while nominating, for example by default the token we charge is USDC
    // _tokenCharge value should be multiply with decimals(wei) according to the token and then passed to this function
    // _nftCharge value should be multiply with decimals(wei) according to the token and then passed to this function
    // _percentage amount must be multiplied with 100 and pass the integer value only, decimal won't work here
    /// @param _tokenAddress is the address of the token which platform wants to charge while owner nominate the nominee
    function changeCharges(
        address _tokenAddress,
        uint _tokenCharge,
        uint _nftCharge,
        uint _percentage
    ) public onlyOwner {
        chargeTokenAddress = _tokenAddress;
        tokenCharge = _tokenCharge;
        nftCharge = _nftCharge;
        percentage = _percentage;
    }

    function setDateForNominee(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _category,
        string memory _date,
        uint _index
    ) public {
        if (_category == 0) {
            ownerToTokenToStruct[_owner][_tokenAddress][_index]
                .claimingDate = _date;
        } else if (_category == 1) {
            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][_index]
                .claimingDate = _date;
        }
    }

    function changeCanClaim(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _category,
        uint _index
    ) public {
        if (_category == 0) {
            for (
                uint i = 0;
                i <
                ownerToTokenToStruct[_owner][_tokenAddress][_index]
                    .nominee
                    .length;
                i++
            ) {
                if (
                    i ==
                    (ownerToTokenToStruct[_owner][_tokenAddress][_index]
                        .nominee
                        .length - 1)
                ) {
                    ownerToTokenToStruct[_owner][_tokenAddress][_index]
                        .canClaim = ownerToTokenToStruct[_owner][_tokenAddress][
                        _index
                    ].charityAddress;
                } else {
                    if (
                        ownerToTokenToStruct[_owner][_tokenAddress][_index]
                            .nominee[i] ==
                        ownerToTokenToStruct[_owner][_tokenAddress][_index]
                            .canClaim
                    ) {
                        ownerToTokenToStruct[_owner][_tokenAddress][_index]
                            .canClaim = ownerToTokenToStruct[_owner][
                            _tokenAddress
                        ][_index].nominee[i + 1];
                    }
                }
            }
        } else if (_category == 1) {
            for (
                uint i = 0;
                i <
                ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][_index]
                    .nominee
                    .length;
                i++
            ) {
                if (
                    i ==
                    (ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][_index]
                        .nominee
                        .length - 1)
                ) {
                    ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][_index]
                        .canClaim = ownerToNFTToStruct[_owner][_tokenAddress][
                        _tokenId
                    ][_index].charityAddress;
                } else {
                    if (
                        ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][
                            _index
                        ].nominee[i] ==
                        ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][
                            _index
                        ].canClaim
                    ) {
                        ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][
                            _index
                        ].canClaim = ownerToNFTToStruct[_owner][_tokenAddress][
                            _tokenId
                        ][_index].nominee[i + 1];
                    }
                }
            }
        }
    }

    function getAllStructs(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _category
    ) public view returns (MultiplePriority[] memory) {
        if (_category == 0) {
            return ownerToTokenToStruct[_owner][_tokenAddress];
        } else if (_category == 1) {
            return ownerToNFTToStruct[_owner][_tokenAddress][_tokenId];
        }
    }
}
