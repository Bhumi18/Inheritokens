//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title Multiple nominee and Priority nominee Functionality
/// @author Bhumi Sadariya

import "./Inheritokens.sol";
import "./Charity.sol";

contract NominateNFTs is Ownable {
    Inheritokens public inheritokens;
    CharityContract public charityContract;
    uint public nftCharge = 5000000;
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
        address charityAddress;
        address canClaim;
        address[] nominee;
        bool isClaimed;
        string claimingDate;
    }

    // mapping of owner address to NFT to struct
    mapping(address => mapping(address => mapping(uint => MultiplePriority)))
        public ownerToNFTToStruct;

    // event
    event NFTsNominated(
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
        uint _category
    );
    event Recovered(
        address indexed _owner,
        address indexed _tokenAddress,
        uint _tokenId,
        uint _category
    );

    /// @param _tokenAddress is the address of the token contract, _tokenName is the name of the token, data is the MultiplePriority sturucture
    function nominateNFT(
        address _tokenAddress,
        string memory _tokenName,
        uint _tokenId,
        MultiplePriority memory data
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
        for (uint k = 0; k < data.nominee.length; k++) {
            flag = false;
            for (uint j = 0; j < nominees.length; j++) {
                if (data.nominee[k] == nominees[j]) {
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
            if (data.charityAddress == _charityAddress) {
                hasFlag = true;
                break;
            }
        }
        if (hasFlag == false) {
            revert("Oops! charity is not white-listed.");
        }

        // get data of whether token is nominated at least once
        bool nominated;

        (, , , , , nominated) = inheritokens.nftAddressToTokenStruct(
            msg.sender,
            _tokenAddress,
            _tokenId
        );

        // if token is not nominated at least for once then assign data to Token struct of inheritokens contract
        if (!nominated) {
            inheritokens.assignTokenStruct(
                msg.sender,
                _tokenAddress,
                _tokenName,
                1,
                _tokenId,
                100
            );
        } else {
            IERC20 _token = IERC20(chargeTokenAddress);
            require(
                _token.allowance(msg.sender, address(this)) >= nftCharge,
                "allowance is not enough!"
            );
            _token.transferFrom(msg.sender, address(this), nftCharge);
            delete ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId];
            ownerToNFTToStruct[msg.sender][_tokenAddress][_tokenId] = (data);
        }

        emit NFTsNominated(msg.sender, _tokenAddress, _tokenId, 1);
    }

    // claim
    /// @param _owner is the owner's address, _tokenAddress is the address of the token, _tokenId is the token Id of the asset
    function claim(
        address _owner,
        address _tokenAddress,
        uint _tokenId
    ) public {
        require(inheritokens.getIsClaimable(_owner), "claim is not allowed.");

        bool flag;

        if (
            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId].canClaim ==
            msg.sender &&
            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId].isClaimed ==
            false
        ) {
            // function call
            nftTransferLogic(_owner, _tokenAddress, _tokenId);

            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId]
                .isClaimed = true;
            flag = true;
        }

        if (flag == false) {
            revert("claim is not allowed.");
        }

        emit Claimed(_owner, msg.sender, _tokenAddress, _tokenId, 1);
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
    /// @param _owner is the owner's address, _tokenAddress is the address of the token, _tokenId is the token Id of the asset
    function recoveryClaim(
        address _owner,
        address _tokenAddress,
        uint _tokenId
    ) public {
        // transfer logic
        // check the user who is calling the function has the address same as recovery address of the owner
        require(
            inheritokens.getOwnerDetails(_owner).recoveryAddress == msg.sender,
            "The recovery address or owner address is incorrect!"
        );
        require(
            !(inheritokens.getIsClaimable(_owner)),
            "Your assets are already claimed by the nominee."
        );

        nftTransferLogic(_owner, _tokenAddress, _tokenId);

        emit Recovered(_owner, _tokenAddress, _tokenId, 1);
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
    // _nftCharge value should be multiply with decimals(wei) according to the token and then passed to this function
    /// @param _tokenAddress is the address of the token which platform wants to charge while owner nominate the nominee
    function changeCharges(
        address _tokenAddress,
        uint _nftCharge
    ) public onlyOwner {
        chargeTokenAddress = _tokenAddress;
        nftCharge = _nftCharge;
    }

    function setDateForNominee(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        string memory _date
    ) public {
        ownerToNFTToStruct[_owner][_tokenAddress][_tokenId]
            .claimingDate = _date;
    }

    function changeCanClaim(
        address _owner,
        address _tokenAddress,
        uint _tokenId
    ) public {
        uint len = ownerToNFTToStruct[_owner][_tokenAddress][_tokenId]
            .nominee
            .length;
        if (
            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId].canClaim ==
            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId].nominee[len - 1]
        ) {
            ownerToNFTToStruct[_owner][_tokenAddress][_tokenId]
                .canClaim = ownerToNFTToStruct[_owner][_tokenAddress][_tokenId]
                .charityAddress;
        } else {
            for (uint i = 0; i < len - 1; i++) {
                if (
                    ownerToNFTToStruct[_owner][_tokenAddress][_tokenId].nominee[
                        i
                    ] ==
                    ownerToNFTToStruct[_owner][_tokenAddress][_tokenId].canClaim
                ) {
                    ownerToNFTToStruct[_owner][_tokenAddress][_tokenId]
                        .canClaim = ownerToNFTToStruct[_owner][_tokenAddress][
                        _tokenId
                    ].nominee[i + 1];
                    break;
                }
            }
        }
    }

    function getAllStructs(
        address _owner,
        address _tokenAddress,
        uint _tokenId
    ) public view returns (MultiplePriority memory) {
        return ownerToNFTToStruct[_owner][_tokenAddress][_tokenId];
    }
}
