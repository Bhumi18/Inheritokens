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

// Inheritokens contract address is 0xce67B9F502de4D3161a3B58474194834728081C8
// charityContract contract address is 0x9E70B5585A9b8b74C05741193679CDDb3C106D3D
// multipleNominee contract address is 0xDDC14799923Cf033696876CfD312940d22a2019e