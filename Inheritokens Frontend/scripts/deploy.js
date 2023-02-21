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

// Inheritokens contract address is 0xD38d3e6221847E979775109e8072ed0886D93529
// charityContract contract address is 0x60837fC26576C4988977FF3160B93d3244f48e8d
// multipleNominee contract address is 0x88681842f0eA964461e1dFC836c7E44e55131286