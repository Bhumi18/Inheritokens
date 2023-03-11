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
    address public inheritokensAddress;
    Inheritokens public inheritokens;
    address public charityContractAddress;
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
        inheritokensAddress = _inheritokensAddress;
        inheritokens = Inheritokens(inheritokensAddress);
        charityContractAddress = _charityContractAddress;
        charityContract = CharityContract(charityContractAddress);
    }

    // structure for multiple and Priority nominee
    struct MultiplePriority {
        uint share;
        uint charityId;
        address[] nominee;
        bool[] isNotAvailable; // true means not available and false means available
        bool[] isClaimed; // true means nominee has claimed
        bool isDone; // true means it is reached to the charity
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
        uint _tokenId,
        uint _category
    );
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
            "Your email has not yet been validated. Verify your registered email address first."
        );

        // check passed nominees in data are added
        address[] memory nominees = inheritokens.getAllNomineesOfOwner(
            msg.sender
        );
        bool flag;
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
                    revert(
                        "Check that all the nominees you are nominating are added as nominees."
                    );
                }
            }
        }

        uint[] memory listedCharities = inheritokens.getWhiteListedCharities(
            msg.sender
        );
        bool hasFlag;
        for (uint i = 0; i < data.length; i++) {
            for (uint j = 0; j < listedCharities.length; j++) {
                if (data[i].charityId == listedCharities[j]) {
                    hasFlag = true;
                    break;
                }
                if (hasFlag == false) {
                    revert(
                        "Check that the charity you are nominating is listed as a white-listed charity."
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
        require(
            totalShare <= 100,
            "Oops! You can only allocate a 100% share. Try to reduce the share amount."
        );
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
        } else {
            IERC20 _token = IERC20(chargeTokenAddress);
            if (_category == 0) {
                require(
                    _token.allowance(msg.sender, address(this)) >= tokenCharge,
                    "The allowance to the contract is not enough!"
                );
                _token.transferFrom(msg.sender, address(this), tokenCharge);
                delete ownerToTokenToStruct[msg.sender][_tokenAddress];
            } else if (_category == 1) {
                require(
                    _token.allowance(msg.sender, address(this)) >= nftCharge,
                    "The allowance to the contract is not enough!"
                );
                _token.transferFrom(msg.sender, address(this), nftCharge);
                delete ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId];
            } else {
                revert(
                    "The category value must be 0 for tokens and 1 for NFT."
                );
            }
        }
        // if token is already assigned then delete the data
        // uint len;
        // if (_category == 0) {
        //     len = ownerToTokenToStruct[msg.sender][_tokenAddress].length;
        //     if (len > 0) {
        //         delete ownerToTokenToStruct[msg.sender][_tokenAddress];
        //     }
        // } else {
        //     len = ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId]
        //         .length;
        //     if (len > 0) {
        //         delete ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId];
        //     }
        // }
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
        emit TokensAssigned(msg.sender, _tokenAddress, _tokenId, _category);
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
        bool isClaimable = inheritokens.getIsClaimable(_owner);
        require(
            isClaimable,
            "Sorry! You can't claim this. We will mail you to claim this."
        );
        address[] memory nominees = inheritokens.getAllNomineesOfOwner(_owner);
        uint transferToNominee;
        for (uint i = 0; i < nominees.length; i++) {
            if (nominees[i] == msg.sender) {
                // transfer logic
                // fot tokens
                if (_category == 0) {
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
                                if (j == 0) {
                                    // function call
                                    transferToNominee = tokenTransferLogic(
                                        k,
                                        j,
                                        _tokenAddress,
                                        _owner
                                    );
                                    break;
                                } else {
                                    if (
                                        ownerToTokenToStruct[_owner][
                                            _tokenAddress
                                        ][k].isNotAvailable[j - 1] ==
                                        true &&
                                        ownerToTokenToStruct[_owner][
                                            _tokenAddress
                                        ][k].isClaimed[j - 1] ==
                                        false
                                    ) {
                                        // function call
                                        transferToNominee = tokenTransferLogic(
                                            k,
                                            j,
                                            _tokenAddress,
                                            _owner
                                        );
                                        break;
                                    } else {
                                        revert(
                                            "Oops! You can't claim this right now. We will inform you when you can claim the token."
                                        );
                                    }
                                }
                            }
                        }
                    }
                } else if (_category == 1) {
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
                                if (j == 0) {
                                    // function call
                                    transferNFTLogic(
                                        k,
                                        k,
                                        _tokenId,
                                        _tokenAddress,
                                        _owner
                                    );
                                    break;
                                } else {
                                    if (
                                        ownerToTokenToStruct[_owner][
                                            _tokenAddress
                                        ][k].isNotAvailable[j - 1] ==
                                        true &&
                                        ownerToTokenToStruct[_owner][
                                            _tokenAddress
                                        ][k].isClaimed[j - 1] ==
                                        false
                                    ) {
                                        // function call
                                        transferNFTLogic(
                                            k,
                                            k,
                                            _tokenId,
                                            _tokenAddress,
                                            _owner
                                        );
                                        break;
                                    } else {
                                        revert(
                                            "Oops! You can't claim this right now. We will inform you when you can claim the token."
                                        );
                                    }
                                }
                            }
                        }
                    }
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
    }

    function tokenTransferLogic(
        uint k,
        uint j,
        address _tokenAddress,
        address _owner
    ) internal returns (uint) {
        uint _share = ownerToTokenToStruct[_owner][_tokenAddress][k].share;
        ownerToTokenToStruct[_owner][_tokenAddress][k].isClaimed[j] = true;

        IERC20 _token = IERC20(_tokenAddress);
        uint _totalToken = _token.balanceOf(_owner);
        uint _finalAmount = (_totalToken * _share) / 100;
        // contract charge
        uint transferToContract = (_finalAmount * percentage) / (10000);

        // value nominee will get
        uint transferToNominee = (_finalAmount - transferToContract);

        // to contract
        _token.transferFrom(_owner, address(this), transferToContract);

        // to nominee
        _token.transferFrom(_owner, msg.sender, transferToNominee);
        return transferToNominee;
    }

    function transferNFTLogic(
        uint k,
        uint j,
        uint _tokenId,
        address _tokenAddress,
        address _owner
    ) internal {
        IERC721 _nft = IERC721(_tokenAddress);

        // transfer to nominee
        _nft.transferFrom(_owner, msg.sender, _tokenId);

        ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][k].isClaimed[
                j
            ] = true;
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
        uint _totalToken;
        if (_category == 0) {
            IERC20 _token = IERC20(_tokenAddress);
            _totalToken = _token.balanceOf(_owner);

            // contract charge
            uint transferToContract = (_totalToken * percentage) / (10000);

            // value nominee will get
            uint transferToNominee = (_totalToken - transferToContract);

            // to contract
            _token.transferFrom(_owner, address(this), transferToContract);

            // to nominee
            _token.transferFrom(_owner, msg.sender, transferToNominee);
        } else if (_tokenId > 0) {
            IERC721 _token = IERC721(_tokenAddress);
            _token.transferFrom(_owner, msg.sender, _tokenId);
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

    // charity claim

    function charityClaim(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _category
    ) public payable {
        uint[] memory listedCharities = inheritokens.getWhiteListedCharities(
            _owner
        );
        address charityAddress;
        if (_category == 0) {
            for (
                uint i = 0;
                i < ownerToTokenToStruct[_owner][_tokenAddress].length;
                i++
            ) {
                if (
                    ownerToTokenToStruct[_owner][_tokenAddress][i].isDone ==
                    false
                ) {
                    for (
                        uint j = 0;
                        j <
                        ownerToTokenToStruct[_owner][_tokenAddress][i]
                            .isNotAvailable
                            .length;
                        j++
                    ) {
                        if (
                            ownerToTokenToStruct[_owner][_tokenAddress][i]
                                .isNotAvailable[j] ==
                            false &&
                            ownerToTokenToStruct[_owner][_tokenAddress][i]
                                .isClaimed[j] ==
                            true
                        ) {
                            revert(
                                "Sorry! You cannot claim it now. If Nominee does not claim, then we will inform you."
                            );
                        }
                    }

                    for (uint k = 0; k < listedCharities.length; k++) {
                        (, charityAddress, , , ) = charityContract.idToCharity(
                            listedCharities[k]
                        );
                        if (charityAddress == msg.sender) {
                            uint _share = ownerToTokenToStruct[_owner][
                                _tokenAddress
                            ][i].share;
                            IERC20 _token = IERC20(_tokenAddress);
                            // uint _totalToken = _token.balanceOf(_owner);
                            uint _finalAmount = ((_token.balanceOf(_owner)) *
                                _share) / 100;
                            // contract charge
                            uint transferToContract = (_finalAmount *
                                percentage) / (10000);

                            // value charity will get
                            uint transferToCharity = (_finalAmount -
                                transferToContract);

                            // to contract
                            _token.transferFrom(
                                _owner,
                                address(this),
                                transferToContract
                            );

                            // to charity
                            _token.transferFrom(
                                _owner,
                                msg.sender,
                                transferToCharity
                            );
                            ownerToTokenToStruct[_owner][_tokenAddress][i]
                                .isDone = true;
                        }
                    }
                }
            }
        } else if (_category == 1) {
            for (
                uint i = 0;
                i < ownerToNFTToStruct[_owner][_tokenAddress][_tokenId].length;
                i++
            ) {
                if (
                    ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][i]
                        .isDone == false
                ) {
                    for (
                        uint j = 0;
                        j <
                        ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][i]
                            .isNotAvailable
                            .length;
                        j++
                    ) {
                        if (
                            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][
                                i
                            ].isNotAvailable[j] ==
                            false &&
                            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][
                                i
                            ].isClaimed[j] ==
                            true
                        ) {
                            revert(
                                "Sorry! You cannot claim it now. If Nominee does not claim, then we will inform you."
                            );
                        }
                    }
                    for (uint k = 0; k < listedCharities.length; k++) {
                        (, charityAddress, , , ) = charityContract.idToCharity(
                            listedCharities[k]
                        );
                        if (charityAddress == msg.sender) {
                            IERC721 _nft = IERC721(_tokenAddress);

                            // transfer to charity
                            _nft.transferFrom(_owner, msg.sender, _tokenId);
                            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId][
                                i
                            ].isDone = true;
                        }
                    }
                }
            }
        }
    }

    /// @notice this function is to change the token we charge while nominating, for example by default the token we charge is USDC
    /// @param _tokenAddress is the address of the token which platform wants to charge while owner nominate the nominee
    function changeChargeTokenAddress(address _tokenAddress) public onlyOwner {
        chargeTokenAddress = _tokenAddress;
    }

    /// @notice _charge value should be multiply with decimals(wei) according to the token and then passed to this function
    function changeTokenCharge(uint _charge) public onlyOwner {
        tokenCharge = _charge;
    }

    /// @notice _charge value should be multiply with decimals(wei) according to the token and then passed to this function
    function changeNFTCharge(uint _charge) public onlyOwner {
        nftCharge = _charge;
    }

    /// @notice percentage amount must be multiplied with 100 and pass the integer value only, decimal won't work here
    function changePercentage(uint _amount) public onlyOwner {
        percentage = _amount;
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

    /// @return address of token that platform charge, charge for token, charge for NFT, and percentage amount while nominee claim the tokens
    function getValues() public view returns (address, uint, uint, uint) {
        return (chargeTokenAddress, tokenCharge, nftCharge, percentage);
    }
}
