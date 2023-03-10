//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

/// @title Owner & Nominee Functionality
/// @author Bhumi Sadariya

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Inheritokens is Ownable {
    constructor() Ownable() {}

    // all owner's addresses into an array and mapping to check if the owner is already added or not.
    address[] public owners;
    mapping(address => bool) public isOwnerAdded;

    // Owner structure and mapping of the owner's address with Owner structure
    struct Owner {
        string owner_name;
        string owner_email;
        string image_cid;
        string date;
        bool isEmailVerified;
        bool isClaimable;
        bool isResponsed;
        address recoveryAddress;
        address[] nominees;
        uint[] charities;
        uint monthsOfInactivity;
        uint monthsOfSendingMailToOwner;
        uint monthsForNominee;
    }
    mapping(address => Owner) public addressToOwner;

    // Nominee structure and mapping of the nominee's address to the nominee structure
    struct Nominee {
        string nominee_name;
        string nominee_email;
        address nominee_address;
    }
    mapping(address => Nominee) public addressToNominee;
    // mapping of nominee address to bool to check whether nominee is added or not
    mapping(address => bool) public isNomineeAdded;

    // Token Structure
    struct Token {
        address token_address;
        string token_name;
        uint category;
        uint token_id;
        uint allocated_share;
        bool isNominated;
    }
    // mapping of owner address to token address to token structure
    mapping(address => mapping(address => Token))
        public tokenAddressToTokenStruct;
    // mapping of owner address to nft address to token id to token struct
    mapping(address => mapping(address => mapping(uint => Token)))
        public nftAddressToTokenStruct;

    // modifiers
    modifier ownerNotAdded() {
        require(
            !isOwnerAdded[msg.sender],
            "You've already signed up! No further registration is required."
        );
        _;
    }

    modifier ownerAdded() {
        require(
            isOwnerAdded[msg.sender],
            "You must first sign up for an account."
        );
        _;
    }

    modifier emailVerified() {
        require(
            addressToOwner[msg.sender].isEmailVerified,
            "Your email has not yet been validated. Verify your registered email address first."
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

    // owner-----------------------------------------------------------------------

    /// @param _name is the owner's name, _email is the owner's email, and _cid is the cid of profile image.
    function addOwnerDetails(
        string memory _name,
        string memory _email,
        string memory _cid
    ) public ownerNotAdded {
        owners.push(msg.sender);
        addressToOwner[msg.sender].owner_name = _name;
        addressToOwner[msg.sender].owner_email = _email;
        addressToOwner[msg.sender].image_cid = _cid;
        addressToOwner[msg.sender].isEmailVerified = false;
        addressToOwner[msg.sender].isClaimable = false;
        addressToOwner[msg.sender].monthsOfInactivity = 6;
        addressToOwner[msg.sender].monthsOfSendingMailToOwner = 2;
        addressToOwner[msg.sender].monthsForNominee = 2;
        isOwnerAdded[msg.sender] = true;
        emit OwnerRegistered(msg.sender, _name);
    }

    // edit owner's details
    /// @param _name is the owner's name, _email is the owner's email, and _cid is the cid of profile image.
    function editOwnerDetails(
        string memory _name,
        string memory _email,
        string memory _cid
    ) public ownerAdded {
        addressToOwner[msg.sender].owner_name = _name;
        addressToOwner[msg.sender].owner_email = _email;
        addressToOwner[msg.sender].image_cid = _cid;
    }

    // verify owner's email
    function verifyOwnerEmail(address _owner) public onlyOwner {
        require(isOwnerAdded[_owner], "You must first sign up for an account.");
        require(
            !addressToOwner[_owner].isEmailVerified,
            "Your email has already been verified."
        );
        addressToOwner[_owner].isEmailVerified = true;
        emit EmailVerified(_owner);
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

    function checkOwnerAdded(address _owner) public view returns (bool) {
        return isOwnerAdded[_owner];
    }

    function checkEmailVerified(address _owner) public view returns (bool) {
        return addressToOwner[_owner].isEmailVerified;
    }

    function getAllNomineesOfOwner(
        address _owner
    ) public view returns (address[] memory) {
        return addressToOwner[_owner].nominees;
    }

    // nominee---------------------------------------------------------------------

    /// @param _name is the nominee's name, _email is the nominee's email, and _nominee is the nominee's address
    function addNomineesDetails(
        string memory _name,
        string memory _email,
        address _nominee
    ) public ownerAdded emailVerified {
        require(
            !isNomineeAdded[_nominee],
            "This nominee's address has already been added. Try adding a nominee with another account address."
        );
        addressToNominee[_nominee] = Nominee(_name, _email, _nominee);
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
        require(
            isNomineeAdded[_oldNomineeAddress],
            "The nominee's address is not added. So you can't modify the details of this account's address. Please enter the valid address of the nominee."
        );
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

    /// @param _charityId is the ID of the charity that the owner wants to keep in the whitelisted array.
    function setWhiteListedCharities(
        uint _charityId
    ) public ownerAdded emailVerified {
        addressToOwner[msg.sender].charities.push(_charityId);
        emit CharityWhitelisted(msg.sender, _charityId);
    }

    function getWhiteListedCharities(
        address _owner
    ) public view returns (uint[] memory) {
        return addressToOwner[_owner].charities;
    }

    // multiple nominee--------------------------------------------------------

    /// @param _tokenAddress is the address of the token, _tokenName is the name of the token,
    // _category is the ERC20 or ERC721, _tokenId is the id of the ERC721, and amount is the allocated share of the ERC20
    function assignTokenStruct(
        address _owner,
        address _tokenAddress,
        string memory _tokenName,
        uint _category,
        uint _tokenId,
        uint amount
    ) external {
        require(isOwnerAdded[_owner], "You must first sign up for an account.");
        require(
            addressToOwner[_owner].isEmailVerified,
            "Your email has not yet been validated. Verify your registered email address first."
        );
        // for token
        if (_category == 0) {
            tokenAddressToTokenStruct[_owner][_tokenAddress] = Token(
                _tokenAddress,
                _tokenName,
                _category,
                _tokenId,
                amount,
                true
            );
        }
        // for NFT
        else {
            nftAddressToTokenStruct[_owner][_tokenAddress][_tokenId] = Token(
                _tokenAddress,
                _tokenName,
                _category,
                _tokenId,
                amount,
                true
            );
        }

        emit TokenStructureAssigned(_owner, _tokenAddress, _tokenId);
    }

    /// @param _owner is the address of the owner, _tokenAddress is the token address, and amount is the allocated share of ERC20
    function updateAllocatedShare(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _amount,
        uint _category
    ) external {
        require(isOwnerAdded[_owner], "You must first sign up for an account.");
        require(
            addressToOwner[_owner].isEmailVerified,
            "Your email has not yet been validated. Verify your registered email address first."
        );
        // for token
        if (_category == 0) {
            tokenAddressToTokenStruct[_owner][_tokenAddress]
                .allocated_share = _amount;
        }
        // for NFT
        else {
            nftAddressToTokenStruct[_owner][_tokenAddress][_tokenId]
                .allocated_share = _amount;
        }
        emit AllocatedShareUpdated(_owner, _tokenAddress, _amount);
    }

    /// @param _owner is the address of the owner, _tokenAddress is the address of the token, _tokenId is the id of the NFT,
    // _category is the ERC20 or ERC721
    /// @return Token structure
    function getTokenStruct(
        address _owner,
        address _tokenAddress,
        uint _tokenId,
        uint _category
    ) public view returns (Token memory) {
        if (_category == 0) {
            return tokenAddressToTokenStruct[_owner][_tokenAddress];
        } else {
            return nftAddressToTokenStruct[_owner][_tokenAddress][_tokenId];
        }
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

    // Function to call when user respond to our email
    function setResponse() public ownerAdded emailVerified {
        addressToOwner[msg.sender].isResponsed = true;
        emit OwnerResponded(msg.sender);
    }

    /// @param _owner is the owner's address
    function setOwnerNotAlive(address _owner) public onlyOwner {
        require(
            !addressToOwner[_owner].isResponsed,
            "Owner has already responded."
        );
        addressToOwner[_owner].isClaimable = true;
    }

    function getIsClaimable(address _owner) public view returns (bool) {
        return addressToOwner[_owner].isClaimable;
    }
}
