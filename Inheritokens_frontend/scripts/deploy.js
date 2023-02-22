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

// Inheritokens contract address is 0xc81Dbec6918667fca73fb1257A7a55757986A461
// charityContract contract address is 0xfcB7207Abf7f05f0b4Cca36B7347506c7771316F
// multipleNominee contract address is 0x83De91B441645072C7EA55c1832C9Fb222e19C9f