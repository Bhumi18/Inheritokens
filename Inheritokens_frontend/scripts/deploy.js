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

// Inheritokens contract address is 0x9dE1577567faC621F69FBB1506B91ac23ab6e28a
// charityContract contract address is 0x9cF7C877f42Bb94fF059eaC1B80C1deA5B908b0B
// multipleNominee contract address is 0x3CB262001E1C83404ed0b1e1408FcF102f03936A
