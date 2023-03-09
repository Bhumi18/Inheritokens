const hre = require("hardhat");

async function main() {
  const Inheritokens = await hre.ethers.getContractFactory("Inheritokens");
  const inheritokens = Inheritokens.deploy();
  await (await inheritokens).deployed();
  const address = (await inheritokens).address;
  console.log(
    `Inheritokens contract address is ${(await inheritokens).address}`
  );

  const CharityContract = await hre.ethers.getContractFactory(
    "CharityContract"
  );
  const charityContract = CharityContract.deploy();
  await (await charityContract).deployed();
  console.log(
    `charityContract contract address is ${(await charityContract).address}`
  );

  const MultiplePriorityNominee = await hre.ethers.getContractFactory(
    "MultiplePriorityNominee"
  );
  const multiplePriorityNominee = MultiplePriorityNominee.deploy(address);
  await (await multiplePriorityNominee).deployed();
  console.log(
    `multiplePriorityNominee contract address is ${
      (await multiplePriorityNominee).address
    }`
  );
}
main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

// Inheritokens contract address is 0xAE10a756BDCabA70ab9F13736fAf0DE4B2b3f4D7
// charityContract contract address is 0x75cBba99faD842AE4a83706aAfd928a079c0007a
// multipleNominee contract address is 0x6a13Ab26Beb794247c5CfB4ADdA8a17Cc90CCf61
