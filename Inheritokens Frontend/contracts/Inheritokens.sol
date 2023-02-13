// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

/// @title Owner & Nominee Functionality
/// @author Bhumi Sadariya

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Inheritokens is Ownable {
    constructor() Ownable() {}

    // all owners' arrays and mappings to check if the owner is already added or not.
    address[] public owners;
    mapping(address => bool) public isOwnerAdded;

    // Owner structure and mapping of owner's address with Owner struct
    struct Owner {
        string owner_name;
        string owner_email;
        string image_cid;
        bool isEmailVerified;
        bool isAlive;
        address recoveryAddress;
        address[] nominees;
        uint[] charities;
    }
    mapping(address => Owner) public addressToOwner;

    // Nominee structure, mapping of owner's address to array of nominee's address, and mapping of nominee's address to nominee struct
    struct Nominee {
        string nominee_name;
        string nominee_email;
        address nominee_address;
        bool hasClaimed;
    }
    mapping(address => Nominee) public addressToNominee;

    // Token Structure
    struct Token {
        address token_address;
        string token_name;
        uint allocated_share;
        bool isMultipleNominee;
        bool isPriorityNominee;
        bool isNominated;
    }
    // mapping of token address to Token struct
    mapping(address => Token) public tokenAddressToTokenStruct;

    // mapping of owner address to token address to array of nominee address
    mapping(address => mapping(address => address[]))
        public ownerToTokenAddressToNomineeArray;

    // mapping of owner address to nominee address to token address array
    mapping(address => mapping(address => address[]))
        public ownerToNomineeToTokenAddressArray;

    // mapping of nominee address to token address to bool
    mapping(address => mapping(address => mapping(address => bool)))
        public ownerToNomineeAddressToTokenAddressToRight;

    // struct to store owner's response
    struct Response {
        string date;
        bool isResponsed;
    }
    // mapping of owner address to the Response struct
    mapping(address => Response) public ownerToResponse;

    /// @param _name is the owner's name, _email is the owner's email, and _cid is the cid of profile image.
    function addOwnerDetails(
        string memory _name,
        string memory _email,
        string memory _cid
    ) public {
        require(!isOwnerAdded[msg.sender], "Already registered");
        owners.push(msg.sender);
        addressToOwner[msg.sender].owner_name = _name;
        addressToOwner[msg.sender].owner_email = _email;
        addressToOwner[msg.sender].image_cid = _cid;
        addressToOwner[msg.sender].isEmailVerified = false;
        addressToOwner[msg.sender].isAlive = true;
        isOwnerAdded[msg.sender] = true;
    }

    /// @param _owner is the owner's address.
    function verifyOwnerEmail(address _owner) public onlyOwner {
        require(isOwnerAdded[_owner], "First do registration");
        require(
            !addressToOwner[_owner].isEmailVerified,
            "Already your email is verified"
        );
        addressToOwner[_owner].isEmailVerified = true;
    }

    /// @param _owner is the address of the owner, _recoveryAddress is the address which owner wants to add as a backup address
    function addWalletRecovery(
        address _owner,
        address _recoveryAddress
    ) public {
        addressToOwner[_owner].recoveryAddress = _recoveryAddress;
    }

    /// @return uint indicating the total number of owners on our platform
    function getTotalOwners() public view returns (uint) {
        return owners.length;
    }

    // nominee part
    /// @param _name is the nominee's name, _email is the nominee's email, and _nominee is the nominee's address
    function addNomineesDetails(
        string memory _name,
        string memory _email,
        address _nominee
    ) public {
        require(
            isOwnerAdded[msg.sender],
            "First register and verify your email"
        );
        addressToNominee[_nominee] = Nominee(_name, _email, _nominee, false);
        addressToOwner[msg.sender].nominees.push(_nominee);
    }

    /// @param _owner is the address of the owner, _oldNomineeAddress is the old account address of the nominee,
    // _name is the nominee's name, _email is the nominee's email, and _newNomineeAddress is the nominee's address
    function editNomineeDetails(
        address _owner,
        address _oldNomineeAddress,
        string memory _name,
        string memory _email,
        address _newNomineeAddress
    ) public {
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
                i < addressToOwner[_owner].nominees.length;
                i++
            ) {
                if (addressToOwner[_owner].nominees[i] == _oldNomineeAddress) {
                    addressToOwner[_owner].nominees[i] = _newNomineeAddress;
                }
            }
        }
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

    /// @param _owner is the owner's address
    /// @return owner structure
    function getOwnerDetails(
        address _owner
    ) public view returns (Owner memory) {
        return addressToOwner[_owner];
    }

    /// @param _owner is the address of the owner
    /// @return recovery address
    function getRecoveryAddress(address _owner) public view returns (address) {
        return addressToOwner[_owner].recoveryAddress;
    }

    // charity

    /// @param _owner is the address of the owner, _charityId is the id of the chairty owner wants to keep in white
    // listed array
    function setWhiteListedCharities(address _owner, uint _charityId) public {
        addressToOwner[_owner].charities.push(_charityId);
    }

    /// @param _owner is the address of the owner
    /// @return an array of the white listed charities for a given owner
    function getAllWhiteListedCharities(
        address _owner
    ) public view returns (uint[] memory) {
        return addressToOwner[_owner].charities;
    }

    // multiple nominee--------------------------------------------------------------------------

    function pushMultipleNominee(
        address _tokenAddress,
        string memory _tokenName,
        uint amount,
        bool _isMultipleNominee,
        bool _isPriorityNominee
    ) public {
        tokenAddressToTokenStruct[_tokenAddress] = Token(
            _tokenAddress,
            _tokenName,
            amount,
            _isMultipleNominee,
            _isPriorityNominee,
            true
        );
    }

    function processAfterAssignedMultiple(
        address _owner,
        address _tokenAddress,
        address[] memory _nominee,
        uint index
    ) public {
        ownerToTokenAddressToNomineeArray[_owner][_tokenAddress].push(
            _nominee[index]
        );
        ownerToNomineeToTokenAddressArray[_owner][_nominee[index]].push(
            _tokenAddress
        );
        ownerToNomineeAddressToTokenAddressToRight[_owner][_nominee[index]][
            _tokenAddress
        ] = true;
        tokenAddressToTokenStruct[_tokenAddress].isNominated = true;
    }

    function processEditForMultiple(address _tokenAddress, uint amount) public {
        tokenAddressToTokenStruct[_tokenAddress].allocated_share = amount;
    }

    /// @return array of nominee's address
    /// @notice view function to get all the nominees who are nominated for a given token address
    function getAllNomineesAssignedForToken(
        address _owner,
        address _tokenAddress
    ) public view returns (address[] memory) {
        return ownerToTokenAddressToNomineeArray[_owner][_tokenAddress];
    }

    /// @return an array of token's address
    /// @notice view function to get all the tokens for whome nominee is nominated
    function getAllTokensNomineeIsNominated(
        address _owner,
        address _nominee
    ) public view returns (address[] memory) {
        return ownerToNomineeToTokenAddressArray[_owner][_nominee];
    }

    /// @return bool indicating whether nominee has right or not for a given token
    function getNomineeToTokenRight(
        address _owner,
        address _nominee,
        address _tokenAddress
    ) public view returns (bool) {
        return
            ownerToNomineeAddressToTokenAddressToRight[_owner][_nominee][
                _tokenAddress
            ];
    }

    /// @return bool indicating whether token has nominee or not
    function getIsNominated(address _tokenAddress) public view returns (bool) {
        return tokenAddressToTokenStruct[_tokenAddress].isNominated;
    }

    // // priority nominee-------------------------------------------------

    /// @param _owner is the owner's address, _nominee is the address of the nominee, _tokenAddress is the address of
    // the token.
    function removeAssignedPriorityNomineeAddressToToken(
        address _owner,
        address _nominee,
        address _tokenAddress
    ) public {
        ownerToNomineeAddressToTokenAddressToRight[_owner][_nominee][
            _tokenAddress
        ] = false;
    }

    // -------------------------------------
    /// @return an array of owner's address
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /// @param _owner is the owner's address, _date is the date on which we sent the first mail to the nominee.
    function setResponseDate(
        address _owner,
        string memory _date
    ) public onlyOwner {
        ownerToResponse[_owner].date = _date;
    }

    /// @param _owner is the owner's address, _response is whether the owner has replied to the email or not.
    function setResponse(address _owner, bool _response) public {
        ownerToResponse[_owner].isResponsed = _response;
    }

    /// @param _owner is the owner's address
    function setOwnerNotAlive(address _owner) public onlyOwner {
        addressToOwner[_owner].isAlive = false;
    }

    /// @return string of the owner's date when we first send mail to the owner
    function getResponseDate(
        address _owner
    ) public view returns (string memory) {
        return ownerToResponse[_owner].date;
    }

    /// @return bool of owner's response
    function getResponse(address _owner) public view returns (bool) {
        return ownerToResponse[_owner].isResponsed;
    }

    /// @return boolean showing whether the owner is alive or not
    function getOwnerAlive(address _owner) public view returns (bool) {
        return addressToOwner[_owner].isAlive;
    }

    /// @return bool of email is verified or not
    function checkVerification(address _owner) public view returns (bool) {
        return addressToOwner[_owner].isEmailVerified;
    }

    /// @param _nominee is the nominee's address
    function claim(address _nominee) public {
        addressToNominee[_nominee].hasClaimed = true;
    }
}
