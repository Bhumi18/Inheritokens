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
  const charity_address = (await charityContract).address;
  console.log(
    `charityContract contract address is ${(await charityContract).address}`
  );

  const MultiplePriorityNominee = await hre.ethers.getContractFactory(
    "MultiplePriorityNominee"
  );
  const multiplePriorityNominee = MultiplePriorityNominee.deploy(
    address,
    charity_address
  );
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

// Inheritokens contract address is 0xBa9294771806D6909A3FD9C5b5240d71927Dfd2e
// charityContract contract address is 0x8c485Ed4D128c6C862642B39Cb70f3BC9fe8CFb7
// multiplePriorityNominee contract address is 0x9D4be64f5732bcaf6dB88998189D8B30BD84a4fF