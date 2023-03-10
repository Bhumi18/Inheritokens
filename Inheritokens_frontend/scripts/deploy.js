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

// Inheritokens contract address is 0x95CdA43e26242F61B8B52a7bb1e9F28dE5930FE4
// charityContract contract address is 0xFC8589A859f4E7d871926773cA4cEB878bC724D0
// multiplePriorityNominee contract address is 0x179583F1be0728EC9f0291472c908077bb09646F