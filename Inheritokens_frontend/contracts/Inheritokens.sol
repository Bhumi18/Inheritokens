//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

/// @title Owner & Nominee Functionality
/// @author Bhumi Sadariya

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract Inheritokens is Ownable {
    constructor() Ownable() {}

    // all owner's addresses array and mapping to check if the owner is already added or not.
    address[] public owners;
    mapping(address => bool) public isOwnerAdded;

    // Owner structure and mapping of owner's address with Owner struct
    struct Owner {
        string owner_name;
        string owner_email;
        string image_cid;
        string date;
        bool isEmailVerified;
        bool isAlive;
        bool isResponsed;
        address recoveryAddress;
        address[] nominees;
        uint[] charities;
        uint monthsOfInactivity;
        uint monthsOfSendingMailToOwner;
        uint monthsForNominee;
    }
    mapping(address => Owner) public addressToOwner;

    // Nominee structure, and mapping of nominee's address to nominee struct
    struct Nominee {
        string nominee_name;
        string nominee_email;
        address nominee_address;
        bool hasClaimed;
    }
    mapping(address => Nominee) public addressToNominee;
    // mapping of nominee address to bool to check whether nominee is added or not
    mapping(address => bool) public isNomineeAdded;

    // Token Structure
    struct Token {
        address token_address;
        string token_name;
        string category;
        uint token_id;
        uint allocated_share;
        bool isNominated;
    }
    // mapping of owner address to token address to Token struct
    mapping(address => mapping(address => mapping(uint => Token)))
        public tokenAddressToTokenStruct;

    // modifiers
    modifier ownerAdded() {
        require(isOwnerAdded[msg.sender], "First do registration");
        _;
    }

    modifier emailVerified() {
        require(
            addressToOwner[msg.sender].isEmailVerified,
            "email is not verified"
        );
        _;
    }

    // events

    event OwnerRegistered(address indexed _owner, string _name);
    event EmailVerified(address indexed _owner);
    event RecoveryAddressAdded(
        address indexed _owner,
        address _recoveryAddress
    );
    event TimePeriodsUpdated(
        address indexed _owner,
        uint _inactivity,
        uint _mail,
        uint _nominee
    );
    event NomineeAdded(
        address indexed _owner,
        address _nominee,
        string _name,
        string _mail
    );
    event NomineeDetailsUpdated(
        address indexed _owner,
        address indexed _oldAddress,
        address indexed _newAddress,
        string _name,
        string _mail
    );
    event CharityWhitelisted(address indexed _owner, uint _charityId);
    event TokenStructureAssigned(
        address indexed _owner,
        address indexed _tokenAddress,
        uint indexed _tokenId
    );
    event AllocatedShareUpdated(
        address indexed _owner,
        address indexed _tokenAddress,
        uint _amount
    );
    event ResponsedDateSet(address indexed _owner, string _date);
    event OwnerResponded(address indexed _owner);
    event Claimed(
        address indexed _owner,
        address indexed _nominee,
        address indexed _tokenAddress,
        uint _tokenId
    );

    // owner-----------------------------------------------------------------------

    /// @param _name is the owner's name, _email is the owner's email, and _cid is the cid of profile image.
    function addOwnerDetails(
        string memory _name,
        string memory _email,
        string memory _cid
    ) public {
        // revert back if the owner is alread added or else proceed
        require(!isOwnerAdded[msg.sender], "Already registered");
        owners.push(msg.sender);
        addressToOwner[msg.sender].owner_name = _name;
        addressToOwner[msg.sender].owner_email = _email;
        addressToOwner[msg.sender].image_cid = _cid;
        addressToOwner[msg.sender].isEmailVerified = false;
        addressToOwner[msg.sender].isAlive = true;
        addressToOwner[msg.sender].monthsOfInactivity = 6;
        addressToOwner[msg.sender].monthsOfSendingMailToOwner = 2;
        addressToOwner[msg.sender].monthsForNominee = 2;
        isOwnerAdded[msg.sender] = true;
        emit OwnerRegistered(msg.sender, _name);
    }

    function verifyOwnerEmail() public onlyOwner ownerAdded {
        require(
            !addressToOwner[msg.sender].isEmailVerified,
            "Already your email is verified"
        );
        addressToOwner[msg.sender].isEmailVerified = true;
        emit EmailVerified(msg.sender);
    }

    /// @param _recoveryAddress is the address which owner wants to add as a backup address
    function addWalletRecovery(
        address _recoveryAddress
    ) public ownerAdded emailVerified {
        addressToOwner[msg.sender].recoveryAddress = _recoveryAddress;
        emit RecoveryAddressAdded(msg.sender, _recoveryAddress);
    }

    function changeTimePeriods(
        uint _inactivity,
        uint _mail,
        uint _nominee
    ) public ownerAdded emailVerified {
        addressToOwner[msg.sender].monthsOfInactivity = _inactivity;
        addressToOwner[msg.sender].monthsOfSendingMailToOwner = _mail;
        addressToOwner[msg.sender].monthsForNominee = _nominee;
        emit TimePeriodsUpdated(msg.sender, _inactivity, _mail, _nominee);
    }

    /// @return uint indicating the total number of owners on our platform
    function getTotalOwners() public view returns (uint) {
        return owners.length;
    }

    /// @return an array of owner's address
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /// @param _owner is the owner's address
    /// @return owner structure
    function getOwnerDetails(
        address _owner
    ) public view returns (Owner memory) {
        return addressToOwner[_owner];
    }

    /// @return boolean showing whether the owner is alive or not
    // function getOwnerAlive(address _owner) public view returns (bool) {
    //     return addressToOwner[_owner].isAlive;
    // }

    /// @param _owner is the address of the owner
    /// @return recovery address
    // function getRecoveryAddress(address _owner) public view returns (address) {
    //     return addressToOwner[_owner].recoveryAddress;
    // }

    // nominee---------------------------------------------------------------------

    /// @param _name is the nominee's name, _email is the nominee's email, and _nominee is the nominee's address
    function addNomineesDetails(
        string memory _name,
        string memory _email,
        address _nominee
    ) public ownerAdded emailVerified {
        require(!isNomineeAdded[_nominee], "Nominee is already added");
        addressToNominee[_nominee] = Nominee(_name, _email, _nominee, false);
        addressToOwner[msg.sender].nominees.push(_nominee);
        isNomineeAdded[_nominee] = true;
        emit NomineeAdded(msg.sender, _nominee, _name, _email);
    }

    /// @param _oldNomineeAddress is the old account address of the nominee,
    // _name is the nominee's name, _email is the nominee's email, and _newNomineeAddress is the nominee's address
    function editNomineeDetails(
        address _oldNomineeAddress,
        string memory _name,
        string memory _email,
        address _newNomineeAddress
    ) public ownerAdded emailVerified {
        require(isNomineeAdded[_oldNomineeAddress], "Nominee is not added");
        if (_oldNomineeAddress == _newNomineeAddress) {
            addressToNominee[_oldNomineeAddress].nominee_name = _name;
            addressToNominee[_oldNomineeAddress].nominee_email = _email;
        } else {
            addressToNominee[_newNomineeAddress].nominee_name = _name;
            addressToNominee[_newNomineeAddress].nominee_email = _email;
            addressToNominee[_newNomineeAddress]
                .nominee_address = _newNomineeAddress;
            for (
                uint256 i = 0;
                i < addressToOwner[msg.sender].nominees.length;
                i++
            ) {
                if (
                    addressToOwner[msg.sender].nominees[i] == _oldNomineeAddress
                ) {
                    addressToOwner[msg.sender].nominees[i] = _newNomineeAddress;
                }
            }
        }
        emit NomineeDetailsUpdated(
            msg.sender,
            _oldNomineeAddress,
            _newNomineeAddress,
            _name,
            _email
        );
    }

    /// @param _owner is the owner address
    /// @return array of nominees's id
    function getAllNominees(
        address _owner
    ) public view returns (address[] memory) {
        return addressToOwner[_owner].nominees;
    }

    /// @param _nominee is the nominee address
    /// @return nominee structure
    function getNomineeDetails(
        address _nominee
    ) public view returns (Nominee memory) {
        return addressToNominee[_nominee];
    }

    // charity-------------------------------------------------------------------

    /// @param _charityId is the id of the chairty owner wants to keep in white
    // listed array
    function setWhiteListedCharities(
        uint _charityId
    ) public ownerAdded emailVerified {
        addressToOwner[msg.sender].charities.push(_charityId);
        emit CharityWhitelisted(msg.sender, _charityId);
    }

    /// @param _owner is the address of the owner
    /// @return an array of the white listed charities for a given owner
    // function getAllWhiteListedCharities(
    //     address _owner
    // ) public view returns (uint[] memory) {
    //     return addressToOwner[_owner].charities;
    // }

    // multiple nominee--------------------------------------------------------

    /// @param _tokenAddress is the address of the token, _tokenName is the name of the token,
    // _category is the ERC20 or ERC721, _tokenId is the id of the ERC721, and amount is the allocated share of the ERC20
    function assignTokenStruct(
        address _owner,
        address _tokenAddress,
        string memory _tokenName,
        string memory _category,
        uint _tokenId,
        uint amount
    ) public {
        require(isOwnerAdded[_owner], "First do registration");
        require(
            addressToOwner[_owner].isEmailVerified,
            "email is not verified"
        );
        tokenAddressToTokenStruct[_owner][_tokenAddress][_tokenId] = Token(
            _tokenAddress,
            _tokenName,
            _category,
            _tokenId,
            amount,
            true
        );
        emit TokenStructureAssigned(_owner, _tokenAddress, _tokenId);
    }

    /// @param _owner is the address of the owner, _tokenAddress is the token address, and amount is the allocated share of ERC20
    function updateAllocatedShare(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _amount
    ) external {
        require(isOwnerAdded[_owner], "First do registration");
        require(
            addressToOwner[_owner].isEmailVerified,
            "email is not verified"
        );
        tokenAddressToTokenStruct[_owner][_tokenAddress][_tokenId]
            .allocated_share = _amount;
        emit AllocatedShareUpdated(_owner, _tokenAddress, _amount);
    }

    /// @return bool indicating whether token has nominee or not
    // function getIsNominated(
    //     address _owner,
    //     address _tokenAddress,
    //     uint _tokenId
    // ) public view returns (bool) {
    //     return tokenAddressToTokenStruct[_owner][_tokenAddress][_tokenId].isNominated;
    // }

    function getTokenStruct(
        address _owner,
        address _tokenAddress,
        uint _tokenId
    ) public view returns (Token memory) {
        return tokenAddressToTokenStruct[_owner][_tokenAddress][_tokenId];
    }

    // response-----------------------------------------------------

    /// @param _owner is the owner's address, _date is the date on which we sent the first mail to the nominee.
    function setResponseDate(
        address _owner,
        string memory _date
    ) public onlyOwner {
        addressToOwner[_owner].date = _date;
        emit ResponsedDateSet(_owner, _date);
    }

    function setResponse() public {
        addressToOwner[msg.sender].isResponsed = true;
        emit OwnerResponded(msg.sender);
    }

    /// @param _owner is the owner's address
    function setOwnerNotAlive(address _owner) public onlyOwner {
        addressToOwner[_owner].isAlive = false;
    }

    // claim--------------------------------------------------------

    /// @param _owner is the owner's address, _tokenAddress is the address of the token, _amount is the amount of the ERC20,
    // _tokenId is the token Id of the asset
    function claim(
        address _owner,
        address _tokenAddress,
        uint _amount,
        uint _tokenId
    ) public {
        for (uint i = 0; i < addressToOwner[_owner].nominees.length; i++) {
            if (addressToOwner[_owner].nominees[i] == msg.sender) {
                addressToNominee[msg.sender].hasClaimed = true;
                // transfer logic
                if (_tokenId == 0) {
                    IERC20 _token = IERC20(_tokenAddress);
                    _token.transferFrom(_owner, msg.sender, _amount);
                } else if (_tokenId > 0) {
                    IERC721 _token = IERC721(_tokenAddress);
                    _token.transferFrom(_owner, msg.sender, _tokenId);
                }
            }
        }
        emit Claimed(_owner, msg.sender, _tokenAddress, _tokenId);
    }

    /// @return string of the owner's date when we first send mail to the owner
    // function getResponseDate(
    //     address _owner
    // ) public view returns (string memory) {
    //     return ownerToResponse[_owner].date;
    // }

    // /// @return bool of owner's response
    // function getResponse(address _owner) public view returns (bool) {
    //     return ownerToResponse[_owner].isResponsed;
    // }

    /// @return bool of email is verified or not
    // function checkVerification(address _owner) public view returns (bool) {
    //     return addressToOwner[_owner].isEmailVerified;
    // }
}
