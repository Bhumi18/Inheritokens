const hre = require("hardhat");

async function main() {
  const Inheritokens = await hre.ethers.getContractFactory("Inheritokens");
  const inheritokens = Inheritokens.deploy();
  await (await inheritokens).deployed();
  const address = (await inheritokens).address;
  console.log(
    `Inheritokens contract address is ${(await inheritokens).address}`
  );

  // const CharityContract = await hre.ethers.getContractFactory(
  //   "CharityContract"
  // );
  // const charityContract = CharityContract.deploy();
  // await (await charityContract).deployed();
  // console.log(
  //   `charityContract contract address is ${(await charityContract).address}`
  // );

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

// Inheritokens contract address is 0x85085FfFEb6C7a07b6B87fC87531a46cB54399cD
// charityContract contract address is 0x9cF7C877f42Bb94fF059eaC1B80C1deA5B908b0B
// multipleNominee contract address is 0x7C04FeEd6fE39aceaa3249F49fEABa3ebF39Ec75
