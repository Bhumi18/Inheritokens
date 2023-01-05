//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

/// @title Owner & Nominee Functionality
/// @author Bhumi Sadariya

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
    constructor() Ownable() {}

    // all owners' arrays and mappings to check if the owner is already added or not.
    address[] public owners;
    mapping(address => bool) public isOwnerAdded;

    // Owner structure and address mapping with owner structure
    struct Owner {
        string owner_name;
        string owner_email;
        string image_cid;
        bool isEmailVerified;
        bool isAlive;
    }
    mapping(address => Owner) public addressToOwner;
    // mapping of owner's address to recovery address for wallet recovery functionality
    mapping(address => address) public ownerToRecoverAddress;

    // Nominee structure, mapping of owner to nominee's address array, and mapping of address to nominee
    // structure
    struct Nominee {
        string nominee_name;
        string nominee_email;
        address nominee_address;
        bool hasClaimed;
    }
    mapping(address => Nominee) public addressToNominee;
    mapping(address => address[]) public ownerToNominees;

    // Token Structure
    struct Token {
        address token_address;
        string token_name;
        uint256 allocated_share;
        bool isMultipleNominee;
        bool isPriorityNominee;
    }
    // mapping of token address to Token struct
    mapping(address => Token) public tokenAddressToTokenStruct;
    // mapping of owner address to token address to nominee address
    mapping(address => mapping(address => address[]))
        public ownerToTokenAddressToNomineeArray;
    // mapping of owner address to nominee address to token address array
    mapping(address => mapping(address => address[]))
        public ownerToNomineeToTokenAddressArray;
    // mapping of owner address to nominee address to token address to share
    mapping(address => mapping(address => mapping(address => uint256)))
        public ownerToNomineeToTokenAddressToShare;
    // mapping of nominee address to token address to bool
    mapping(address => mapping(address => mapping(address => bool)))
        public ownerToNomineeAddressToTokenAddressToRight;
    // mapping of owner address to the token address to the bool
    mapping(address => mapping(address => bool)) public isNominated;

    // struct to store owner's response
    struct Response {
        string date;
        bool isResponsed;
    }
    // mapping of owner address to the Response struct
    mapping(address => Response) public ownerToResponse;

    /// @param name is the owner's name, email is the owner's email, and cid is the cid of profile image.
    function addOwnerDetails(
        string memory name,
        string memory email,
        string memory cid
    ) public {
        if (!isOwnerAdded[msg.sender]) {
            owners.push(msg.sender);
            isOwnerAdded[msg.sender] = true;
            addressToOwner[msg.sender] = Owner(name, email, cid, false, true);
        }
    }

    /// @param _owner is the owner's address.
    function verifyOwner(address _owner) public onlyOwner {
        addressToOwner[_owner].isEmailVerified = true;
    }

    /// @param _owner is the address of the owner, _recover is the address which owner wants to add as a
    // backup address
    function addWalletRecovery(address _owner, address _recover) public {
        ownerToRecoverAddress[_owner] = _recover;
    }

    /// @param name is the nominee's name, email is the nominee's email, and nominee_address
    /// is the nominee's address
    function addNomineesDetails(
        string memory name,
        string memory email,
        address nominee_address
    ) public {
        addressToNominee[nominee_address] = Nominee(
            name,
            email,
            nominee_address,
            false
        );
        ownerToNominees[msg.sender].push(nominee_address);
    }

    /// @param name is the nominee's name, email is the nominee's email, and nominee_address
    /// is the nominee's address
    function editNomineeDetails(
        address _owner,
        address _oldNomineeAddress,
        string memory name,
        string memory email,
        address nominee_address
    ) public {
        if (_oldNomineeAddress == nominee_address) {
            addressToNominee[_oldNomineeAddress].nominee_name = name;
            addressToNominee[_oldNomineeAddress].nominee_email = email;
        } else {
            addressToNominee[nominee_address].nominee_name = name;
            addressToNominee[nominee_address].nominee_email = email;
            addressToNominee[nominee_address].nominee_address = nominee_address;
            for (uint256 i = 0; i < ownerToNominees[_owner].length; i++) {
                if (ownerToNominees[_owner][i] == _oldNomineeAddress) {
                    ownerToNominees[_owner][i] = nominee_address;
                }
            }
        }
    }

    /// @param _owner is the owner address
    /// @return array of nominees's id
    function getAllNominees(address _owner)
        public
        view
        returns (address[] memory)
    {
        return ownerToNominees[_owner];
    }

    /// @param _nominee is the nominee address
    /// @return nominee structure
    function getNomineeDetails(address _nominee)
        public
        view
        returns (Nominee memory)
    {
        return addressToNominee[_nominee];
    }

    /// @param owner_address is the owner's address
    /// @return owner structure
    function getOwnerDetails(address owner_address)
        public
        view
        returns (Owner memory)
    {
        return addressToOwner[owner_address];
    }

    /// @param _owner is the address of the owner
    /// @return recovery address
    function getRecoveryAddress(address _owner) public view returns (address) {
        return ownerToRecoverAddress[_owner];
    }

    /// @param _owner is the address of the owner; _nominee is the address of the nominee; _tokenAddress is
    // the address of the token contract, _tokenName is the name of the token, _share is the amount the owner
    // wants to allocate to the nominee, _isMultipleNominee is the boolean value indicating whether this
    // process of nomination involves multiple nominees or not, _isPriorityNominee is a boolean value
    // that indicates whether or not this nomination process is prioritised in terms of nominees
    /// @notice If the share is allocated to 100%, then the owner will not be able to add more nominees for
    // this token. Either he has to remove or edit any of those nominees.
    function assignTokensToNominee(
        address _owner,
        address _nominee,
        address _tokenAddress,
        string memory _tokenName,
        uint256 _share,
        bool _isMultipleNominee,
        bool _isPriorityNominee
    ) public {
        // uint amount = ownerToNomineeToTokenAddressToTokenStruct[_owner][_nominee][_tokenAddress].allocated_share+_share;
        // require(amount<=100, "100% share is already allocated...");
        // ownerToNomineeToTokenAddressToTokenStruct[_owner][_nominee][_tokenAddress]= Token(_tokenAddress,
        // _tokenName, _share, amount, true,_isMultipleNominee,_isPriorityNominee);
        // ownerToTokenAddressToNominee[_owner][_tokenAddress]=_nominee;
        // isNominated[_owner][_tokenAddress]=true;

        uint256 amount = tokenAddressToTokenStruct[_tokenAddress]
            .allocated_share + _share;
        require(amount <= 100, "100% share is already allocated...");
        tokenAddressToTokenStruct[_tokenAddress] = Token(
            _tokenAddress,
            _tokenName,
            amount,
            _isMultipleNominee,
            _isPriorityNominee
        );
        ownerToTokenAddressToNomineeArray[_owner][_tokenAddress].push(_nominee);
        ownerToNomineeToTokenAddressArray[_owner][_nominee].push(_tokenAddress);
        ownerToNomineeToTokenAddressToShare[_owner][_nominee][
            _tokenAddress
        ] = _share;
        ownerToNomineeAddressToTokenAddressToRight[_owner][_nominee][
            _tokenAddress
        ] = true;
        isNominated[_owner][_tokenAddress] = true;
    }

    /// @param _owner is the address of the owner; _oldNominee is the address of the old nominee;
    // _newNominee is the address of the new nominee,  _tokenAddress is the address of the token contract,
    // _tokenName is the name of the token, _share is the amount the owner wants to allocate to the nominee,
    // _isMultipleNominee is the boolean value indicating whether this process of nomination involves
    // multiple nominees or not, _isPriorityNominee is a boolean value that indicates whether or not
    // this nomination process is prioritised in terms of nominees
    function editAssignedTokensToNominee(
        address _owner,
        address _nominee,
        address _tokenAddress,
        uint256 _oldShare,
        uint256 _share,
        bool _isMultipleNominee
    ) public {
        require(_isMultipleNominee, "It is only for multiple nominee");
        ownerToNomineeToTokenAddressToShare[_owner][_nominee][
            _tokenAddress
        ] = _share;
        uint256 amount = tokenAddressToTokenStruct[_tokenAddress]
            .allocated_share -
            _oldShare +
            _share;
        tokenAddressToTokenStruct[_tokenAddress].allocated_share = amount;
    }

    /// @return an array of nominee's address
    /// @notice view function to get all the nominees who are nominated for a given token address
    function getAllNomineesAssignedForToken(
        address _owner,
        address _tokenAddress
    ) public view returns (address[] memory) {
        return ownerToTokenAddressToNomineeArray[_owner][_tokenAddress];
    }

    /// @return an array of token's address
    /// @notice view function to get all the tokens for whome nominee is nominated
    function getAllTokensNomineeIsNominated(address _owner, address _nominee)
        public
        view
        returns (address[] memory)
    {
        return ownerToNomineeToTokenAddressArray[_owner][_nominee];
    }

    /// @return uint indicating share allocated to the nominee for a given token
    function getNomineeToTokenShare(
        address _owner,
        address _nominee,
        address _tokenAddress
    ) public view returns (uint256) {
        return
            ownerToNomineeToTokenAddressToShare[_owner][_nominee][
                _tokenAddress
            ];
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
    function getIsNominated(address _owner, address _tokenAddress)
        public
        view
        returns (bool)
    {
        return isNominated[_owner][_tokenAddress];
    }

    /// @return nominee address
    function checkIsNominated(address _owner, address _token_address)
        public
        view
        returns (bool)
    {
        return isNominated[_owner][_token_address];
    }

    /// @return an array of owner's address
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /// @param _owner is the owner's address, _date is the date on which we sent the first mail to the nominee.
    function setResponseDate(address _owner, string memory _date)
        public
        onlyOwner
    {
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
    function getResponseDate(address _owner)
        public
        view
        returns (string memory)
    {
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
