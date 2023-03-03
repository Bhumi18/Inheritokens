//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title Charity Functionality
/// @author Bhumi Sadariya

contract CharityContract is Ownable {
    constructor() Ownable() {}

    // Charity structure, mapping of charity id to Charity struct
    struct Charity {
        uint id;
        address charity_address;
        string charity_name;
        string charity_description;
        string charity_image;
    }
    uint public charity_id;
    mapping(uint => Charity) public idToCharity;

    // events
    event CharityAdded(
        uint indexed _charityId,
        address indexed _charityAddress,
        string _charityName
    );
    event CharityUpdated(
        uint indexed _charityId,
        address indexed _charityAddress,
        string _charityName
    );

    // charity----------------------------------------------------------------------------------

    /// @param _charityAddress is the address of the charity, _charityName is the name of the charity,
    // _charityDescription is the description about the charity, _charityImage is the cid of the image
    function addCharity(
        address _charityAddress,
        string memory _charityName,
        string memory _charityDescription,
        string memory _charityImage
    ) public onlyOwner {
        charity_id = charity_id + 1;
        idToCharity[charity_id] = Charity(
            charity_id,
            _charityAddress,
            _charityName,
            _charityDescription,
            _charityImage
        );
        emit CharityAdded(charity_id, _charityAddress, _charityName);
    }

    /// @param _charityId is the id of the charity, _charityAddress is the address of the charity, _charityName is the name of the charity,
    // _charityDescription is the description about the charity, _charityImage is the cid of the image
    function editCharityDetails(
        uint _charityId,
        address _charityAddress,
        string memory _charityName,
        string memory _charityDescription,
        string memory _charityImage
    ) public onlyOwner {
        idToCharity[_charityId] = Charity(
            _charityId,
            _charityAddress,
            _charityName,
            _charityDescription,
            _charityImage
        );
        emit CharityUpdated(_charityId, _charityAddress, _charityName);
    }

    /// @param _charityId is the id of the charity
    /// @return struct of the charity
    function getCharityDetailsById(
        uint _charityId
    ) public view returns (Charity memory) {
        return idToCharity[_charityId];
    }

    /// @return the number of the charity available on platform
    function getTotalNumberOfCharity() public view returns (uint) {
        return charity_id;
    }
}
