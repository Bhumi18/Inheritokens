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

  const MultipleNominee = await hre.ethers.getContractFactory(
    "MultipleNominee"
  );
  const multipleNominee = MultipleNominee.deploy(address);
  await (await multipleNominee).deployed();
  console.log(
    `multipleNominee contract address is ${(await multipleNominee).address}`
  );
}
main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

// Inheritokens contract address is 0x2dec54540c6688d81c78D42F1092D237D9a89716
// charityContract contract address is 0x643e4b27aDE053Ee23748d7863A340a8a1dBbfc4
// multipleNominee contract address is 0x6a66B56E1183e35141d14B3aCD0e21284Ca9FD13