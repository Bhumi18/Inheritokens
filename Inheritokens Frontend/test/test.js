const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Inheritokens", function () {
  let inheritokens,
    charityContract,
    multipleNominee,
    priorityNominee,
    owner,
    owner1,
    recover_address,
    nominee1,
    nominee2,
    nominee3,
    charity1,
    charity2;
  let charity_id = 0;
  before(async function () {
    // get accounts
    [
      owner,
      owner1,
      recover_address,
      nominee1,
      nominee2,
      nominee3,
      charity1,
      charity2,
    ] = await ethers.getSigners();

    // contract deployment

    // deploy main contract
    const Inheritokens = await ethers.getContractFactory("Inheritokens");
    inheritokens = Inheritokens.deploy();
    inheritokens = await (await inheritokens).deployed();

    // deploy charity contract
    const CharityContract = await ethers.getContractFactory("CharityContract");
    charityContract = CharityContract.deploy();
    charityContract = await (await charityContract).deployed();

    // deploy multiple nominee contract
    const MultipleNominee = await ethers.getContractFactory("MultipleNominee");
    multipleNominee = await MultipleNominee.deploy(inheritokens.address);
    multipleNominee = await (await multipleNominee).deployed();

    // deploy priority nominee contract
    const PriorityNominee = await ethers.getContractFactory("PriorityNominee");
    priorityNominee = await PriorityNominee.deploy(inheritokens.address);
    priorityNominee = await (await priorityNominee).deployed();
  });

  //   it("check", async function () {
  //     console.log(inheritokens.address);
  //     console.log(charityContract.address);
  //     console.log(multipleNominee.address);
  //     console.log(priorityNominee.address);
  //   });

  // for owner registration
  it("should register owner details", async function () {
    await inheritokens.addOwnerDetails("Bhumi", "bhumi@gmail.com", "abc");
    expect(await inheritokens.isOwnerAdded(owner.address)).to.equal(true);
  });

  //   it("should not register again", async function () {
  //     const len = await inheritokens.getTotalOwners();
  //     await inheritokens.addOwnerDetails("Bhumi", "bhumi@gmail.com", "abc");
  //     expect(await inheritokens.getTotalOwners()).to.equal(len);
  //   });

  it("should allow new owner to register", async function () {
    await inheritokens
      .connect(owner1)
      .addOwnerDetails("Lajja", "lajja@gmail.com", "abc");
    expect(await inheritokens.getTotalOwners()).to.equal(2);
  });

  it("verify first owner's email address", async function () {
    console.log(
      (await inheritokens.addressToOwner(owner.address)).isEmailVerified
    );
    expect(await inheritokens.isOwnerAdded(owner.address)).to.equal(true);
    await inheritokens.connect(owner).verifyOwnerEmail(owner.address);
    expect(
      (await inheritokens.addressToOwner(owner.address)).isEmailVerified
    ).to.equal(true);
  });

  it("verify second owner's email address", async function () {
    console.log(
      (await inheritokens.addressToOwner(owner1.address)).isEmailVerified
    );
    expect(await inheritokens.isOwnerAdded(owner1.address)).to.equal(true);
    await inheritokens.connect(owner).verifyOwnerEmail(owner1.address);
    expect(
      (await inheritokens.addressToOwner(owner1.address)).isEmailVerified
    ).to.equal(true);
  });

  // for wallet recovery
  it("should able to add recovery address", async function () {
    await inheritokens
      .connect(owner)
      .addWalletRecovery(owner.address, recover_address.address);
    expect(await inheritokens.getRecoveryAddress(owner.address)).to.equal(
      recover_address.address
    );
  });

  // for adding nominee
  it("should able to add nominee", async function () {
    await inheritokens.addNomineesDetails(
      "Bhumi1",
      "bhumi1@gmail.com",
      nominee1.address
    );
    const len = (await inheritokens.getAllNominees(owner.address)).length;
    expect(len).to.equal(1);
  });

  it("should able to add second nominee", async function () {
    await inheritokens.addNomineesDetails(
      "Bhumi2",
      "bhumi2@gmail.com",
      nominee2.address
    );
    const len = (await inheritokens.getAllNominees(owner.address)).length;
    expect(len).to.equal(2);
  });

  it("should allow owner to update nominee name and email", async function () {
    await inheritokens.editNomineeDetails(
      owner.address,
      nominee1.address,
      "krupa",
      "krupa@gmail.com",
      nominee1.address
    );
    expect(
      (await inheritokens.getNomineeDetails(nominee1.address)).nominee_name
    ).to.equal("krupa");
    expect(
      (await inheritokens.getNomineeDetails(nominee1.address)).nominee_email
    ).to.equal("krupa@gmail.com");
    // console.log(await inheritokens.getAllNominees(owner.address));
  });

  it("should allow owner to change nominee address", async function () {
    await inheritokens.editNomineeDetails(
      owner.address,
      nominee1.address,
      "krupa Shah",
      "krupa@gmail.com",
      nominee3.address
    );
    expect(
      (await inheritokens.getNomineeDetails(nominee3.address)).nominee_name
    ).to.equal("krupa Shah");
    expect(
      (await inheritokens.getNomineeDetails(nominee3.address)).nominee_email
    ).to.equal("krupa@gmail.com");
    expect(
      (await inheritokens.getNomineeDetails(nominee3.address)).nominee_address
    ).to.equal(nominee3.address);
    // console.log(await inheritokens.getAllNominees(owner.address));
  });

  // for adding charity
  it("should able to add charity", async function () {
    await charityContract.addCharity(
      charity1.address,
      "charity1",
      "charity1",
      "abc"
    );
    expect(await charityContract.getTotalNumberOfCharity()).to.equal(1);
  });

  it("should able to add second charity", async function () {
    await charityContract.addCharity(
      charity2.address,
      "charity2",
      "charity2",
      "abc"
    );
    expect(await charityContract.getTotalNumberOfCharity()).to.equal(2);
  });

  it("should allow to change the charity details", async function () {
    await charityContract.editCharityDetails(
      1,
      charity1.address,
      "char-ity1",
      "charity1",
      "abc"
    );
    expect(
      (await charityContract.getCharityDetailsById(1)).charity_name
    ).to.equal("char-ity1");
  });

  it("should allow owner to set charity as white list", async function () {
    await inheritokens.setWhiteListedCharities(owner.address, 1);
    const len = (await inheritokens.getAllWhiteListedCharities(owner.address))
      .length;
    expect(len).to.equal(1);
  });

  // // for multiple nominee
  // it("should able to assign token to multiple nominee", async function () {
  //     await inheritokens.assignTokensToMultipleNominee(owner.address, nominee1.address, "0x53d00397f03147a9bd9c40443a105a82780deaf1", "fTUSD Fake Token", 50, true, false)
  //     const amount = (await inheritokens.tokenAddressToTokenStruct("0x53d00397f03147a9bd9c40443a105a82780deaf1"))[2]
  //     expect(parseInt(amount)).to.equal(50)
  // })

  // it("should assigned nominee for token address", async function () {
  //     expect((await inheritokens.getAllNomineesAssignedForToken(owner.address, "0x53d00397f03147a9bd9c40443a105a82780deaf1")).length).to.equal(1)
  // })

  // it("shoul assigned token to nominee mapping", async function () {
  //     expect((await inheritokens.getAllTokensNomineeIsNominated(owner.address, nominee1.address)).length).to.equal(1)
  // })

  // it("should assign proper share of token to nominee", async function () {
  //     expect(await inheritokens.ownerToNomineeToTokenAddressToShare(owner.address, nominee1.address, "0x53d00397f03147a9bd9c40443a105a82780deaf1")).to.equal(50)
  // })

  // it("should be able to update the nominee right for assigned token", async function () {
  //     expect(await inheritokens.ownerToNomineeAddressToTokenAddressToRight(owner.address, nominee1.address, "0x53d00397f03147a9bd9c40443a105a82780deaf1")).to.equal(true)
  // })

  // it("should be able to change the value for whether token is nominated or not", async function () {
  //     expect(await inheritokens.isNominated(owner.address, "0x53d00397f03147a9bd9c40443a105a82780deaf1")).to.equal(true)
  // })

  // it("should able to assign token to second multiple nominee", async function () {
  //     await inheritokens.assignTokensToMultipleNominee(owner.address, nominee2.address, "0x53d00397f03147a9bd9c40443a105a82780deaf1", "fTUSD Fake Token", 50, true, false)
  //     const amount = (await inheritokens.tokenAddressToTokenStruct("0x53d00397f03147a9bd9c40443a105a82780deaf1"))[2]
  //     expect(parseInt(amount)).to.equal(100)
  // })

  // it("should allow owner to change the share of the nominee", async function () {
  //     await inheritokens.editAssignedTokensToMultipleNominee(owner.address, nominee1.address, "0x53d00397f03147a9bd9c40443a105a82780deaf1", 50, 40, true)
  //     const amount = (await inheritokens.ownerToNomineeToTokenAddressToShare(owner.address, nominee1.address, "0x53d00397f03147a9bd9c40443a105a82780deaf1"))
  //     expect((amount)).to.equal(40)
  //     const total_share = (await inheritokens.tokenAddressToTokenStruct("0x53d00397f03147a9bd9c40443a105a82780deaf1"))[2]
  //     expect(parseInt(total_share)).to.equal(90)
  // })

  // // for priority nominee
  // it("should able to assign token to priority nominee", async function () {
  //     await inheritokens.assignedTokensToPriorityNominee(owner.address, nominee1.address, "0x88271d333c72e51516b67f5567c728e702b3eee8", "fDAI Fake Token", false, true)
  //     expect(await inheritokens.ownerToNomineeAddressToTokenAddressToRight(owner.address, nominee1.address, "0x88271d333c72e51516b67f5567c728e702b3eee8")).to.equal(true)
  // })

  // it("should change nominee to token address array", async function () {
  //     const arr = await inheritokens.getAllTokensNomineeIsNominated(owner.address, nominee1.address)
  //     let flag
  //     for (let i = 0; i < arr.length; i++) {
  //         if (arr[i].toLowerCase() === "0x88271d333c72e51516b67f5567c728e702b3eee8") {
  //             flag = true
  //         }
  //     }
  //     expect(flag).to.equal(true)
  // })

  // it("should change token to priority nominee array", async function () {
  //     const arr = await inheritokens.getOwnerToTokenAddressToPriorityArray(owner.address, "0x88271d333c72e51516b67f5567c728e702b3eee8")
  //     let flag
  //     for (let i = 0; i < arr.length; i++) {
  //         if (arr[i].toLowerCase() === nominee1.address.toLowerCase()) {
  //             flag = true
  //         }
  //     }
  //     expect(flag).to.equal(true)
  // })

  // it("should be able to change the value for whether token is nominated or not", async function () {
  //     expect(await inheritokens.isNominated(owner.address, "0x88271d333c72e51516b67f5567c728e702b3eee8")).to.equal(true)
  // })

  // it("should allow to change assignedPriority nominee address to token",async function(){
  //     await inheritokens.editAssignedPriorityNomineeAddressToToken(owner.address,nominee1.address,nominee3.address,"0x88271d333c72e51516b67f5567c728e702b3eee8")
  //     const arr = await inheritokens.getOwnerToTokenAddressToPriorityArray(owner.address,"0x88271d333c72e51516b67f5567c728e702b3eee8")
  //     let flag=false
  //     for(let i=0;i<arr.length;i++){
  //         if (arr[i].toLowerCase()===nominee1.address){
  //             flag=true
  //         }
  //     }
  //     expect(flag).to.equal(false)
  // })

  // it("should allow owner to remove nominee from assigned token",async function(){
  //     await inheritokens.removeAssignedPriorityNomineeAddressToToken(owner.address,nominee1.address,"0x88271d333c72e51516b67f5567c728e702b3eee8")
  //     expect(await inheritokens.ownerToNomineeAddressToTokenAddressToRight(owner.address,nominee1.address,"0x88271d333c72e51516b67f5567c728e702b3eee8")).to.equal(false)
  // })
});
