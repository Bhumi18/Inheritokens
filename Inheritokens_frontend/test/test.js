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
    nominee4,
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
      nominee4,
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

    // deploy multiple and priority nominee contract
    const MultipleNominee = await ethers.getContractFactory(
      "MultiplePriorityNominee"
    );
    multipleNominee = await MultipleNominee.deploy(inheritokens.address);
    multipleNominee = await (await multipleNominee).deployed();
  });

  // it("check", async function () {
  //   console.log(inheritokens.address);
  //   console.log(charityContract.address);
  //   console.log(multipleNominee.address);
  //   console.log(priorityNominee.address);
  // });

  // for owner registration
  it("should register owner details", async function () {
    await inheritokens.addOwnerDetails("Bhumi", "bhumi@gmail.com", "abc");
    expect(await inheritokens.isOwnerAdded(owner.address)).to.equal(true);
  });

  // it("should not register again", async function () {
  //   const len = await inheritokens.getTotalOwners();
  //   await inheritokens.addOwnerDetails("Bhumi", "bhumi@gmail.com", "abc");
  //   expect(await inheritokens.getTotalOwners()).to.equal(len);
  // });

  it("should allow new owner to register", async function () {
    await inheritokens
      .connect(owner1)
      .addOwnerDetails("Lajja", "lajja@gmail.com", "abc");
    expect(await inheritokens.getTotalOwners()).to.equal(2);
  });

  it("verify first owner's email address", async function () {
    expect(await inheritokens.isOwnerAdded(owner.address)).to.equal(true);
    await inheritokens.connect(owner).verifyOwnerEmail();
    expect(
      (await inheritokens.addressToOwner(owner.address)).isEmailVerified
    ).to.equal(true);
  });

  it("verify second owner's email address", async function () {
    expect(await inheritokens.isOwnerAdded(owner1.address)).to.equal(true);
    await inheritokens.connect(owner1).verifyOwnerEmail();
    expect(
      (await inheritokens.addressToOwner(owner1.address)).isEmailVerified
    ).to.equal(true);
  });

  // for wallet recovery
  it("should able to add recovery address", async function () {
    await inheritokens
      .connect(owner)
      .addWalletRecovery(recover_address.address);
    expect(
      (await inheritokens.addressToOwner(owner.address)).recoveryAddress
    ).to.equal(recover_address.address);
  });

  // for adding nominee
  it("should able to add nominee", async function () {
    await inheritokens
      .connect(owner)
      .addNomineesDetails("Bhumi1", "bhumi1@gmail.com", nominee1.address);
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
  });

  it("should allow owner to change nominee address", async function () {
    await inheritokens.editNomineeDetails(
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
    await inheritokens.setWhiteListedCharities(1);
    const len = (await inheritokens.getWhiteListedCharities(owner.address))
      .length;
    expect(len).to.equal(1);
  });

  // for multiple nominee
  it("should able to assign token to multiple nominees", async function () {
    await multipleNominee.assignTokensToMultipleNominees(
      "0x53d00397f03147a9bd9c40443a105a82780deaf1",
      "fTUSD Fake Token",
      0,
      0,
      [
        [
          40,
          [nominee1.address, nominee2.address],
          [false, false],
          [false, false],
        ],
        [
          50,
          [nominee2.address, nominee1.address],
          [false, false],
          [false, false],
        ],
      ]
    );
    // console.log(
    //   await inheritokens.tokenAddressToTokenStruct(
    //     owner.address,
    //     "0x53d00397f03147a9bd9c40443a105a82780deaf1"
    //   )
    // );
    const amount = (
      await inheritokens.tokenAddressToTokenStruct(
        owner.address,
        "0x53d00397f03147a9bd9c40443a105a82780deaf1"
      )
    )[4];
    expect(parseInt(amount)).to.equal(90);
    // console.log(
    //   await multipleNominee.getAllStructs(
    //     owner.address,
    //     "0x53d00397f03147a9bd9c40443a105a82780deaf1",
    //     0,
    //     0
    //   )
    // );
    expect(
      (
        await multipleNominee.getAllStructs(
          owner.address,
          "0x53d00397f03147a9bd9c40443a105a82780deaf1",
          0,
          0
        )
      )[0].share
    ).to.equal(40);
    expect(
      (
        await multipleNominee.getAllStructs(
          owner.address,
          "0x53d00397f03147a9bd9c40443a105a82780deaf1",
          0,
          0
        )
      )[1].share
    ).to.equal(50);
    expect(
      (
        await multipleNominee.getAllStructs(
          owner.address,
          "0x53d00397f03147a9bd9c40443a105a82780deaf1",
          0,
          0
        )
      )[0].nominee[0]
    ).to.equal(nominee1.address);
    expect(
      (
        await multipleNominee.getAllStructs(
          owner.address,
          "0x53d00397f03147a9bd9c40443a105a82780deaf1",
          0,
          0
        )
      )[0].nominee[1]
    ).to.equal(nominee2.address);
  });

  // it("should able to edit token to multiple nominees", async function () {
  //   await multipleNominee.assignTokensToMultipleNominees(
  //     "0x53d00397f03147a9bd9c40443a105a82780deaf1",
  //     "fTUSD Fake Token",
  //     0,
  //     0,
  //     [
  //       [
  //         10,
  //         [nominee1.address, nominee2.address],
  //         [false, false],
  //         [false, false],
  //       ],
  //       [
  //         10,
  //         [nominee2.address, nominee1.address],
  //         [false, false],
  //         [false, false],
  //       ],
  //     ]
  //   );
  //   // console.log(
  //   //   await inheritokens.tokenAddressToTokenStruct(
  //   //     owner.address,
  //   //     "0x53d00397f03147a9bd9c40443a105a82780deaf1"
  //   //   )
  //   // );
  //   const amount = (
  //     await inheritokens.tokenAddressToTokenStruct(
  //       owner.address,
  //       "0x53d00397f03147a9bd9c40443a105a82780deaf1"
  //     )
  //   )[4];
  //   expect(parseInt(amount)).to.equal(20);
  //   // console.log(
  //   //   await multipleNominee.getAllStructs(
  //   //     owner.address,
  //   //     "0x53d00397f03147a9bd9c40443a105a82780deaf1",
  //   //     0
  //   //   )
  //   // );
  //   expect(
  //     (
  //       await multipleNominee.getAllStructs(
  //         owner.address,
  //         "0x53d00397f03147a9bd9c40443a105a82780deaf1",
  //         0,
  //         0
  //       )
  //     )[0].share
  //   ).to.equal(10);
  //   expect(
  //     (
  //       await multipleNominee.getAllStructs(
  //         owner.address,
  //         "0x53d00397f03147a9bd9c40443a105a82780deaf1",
  //         0,
  //         0
  //       )
  //     )[1].share
  //   ).to.equal(10);
  //   expect(
  //     (
  //       await multipleNominee.getAllStructs(
  //         owner.address,
  //         "0x53d00397f03147a9bd9c40443a105a82780deaf1",
  //         0,
  //         0
  //       )
  //     )[0].nominee[0]
  //   ).to.equal(nominee1.address);
  //   expect(
  //     (
  //       await multipleNominee.getAllStructs(
  //         owner.address,
  //         "0x53d00397f03147a9bd9c40443a105a82780deaf1",
  //         0,
  //         0
  //       )
  //     )[0].nominee[1]
  //   ).to.equal(nominee2.address);
  // });
});
