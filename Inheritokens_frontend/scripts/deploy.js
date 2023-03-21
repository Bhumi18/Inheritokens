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

  const NominateTokens = await hre.ethers.getContractFactory("NominateTokens");
  const nominateTokens = NominateTokens.deploy(address, charity_address);
  await (await nominateTokens).deployed();
  console.log(
    `nominateTokens contract address is ${(await nominateTokens).address}`
  );

  const NominateNFTs = await hre.ethers.getContractFactory("NominateNFTs");
  const nominateNFTs = NominateNFTs.deploy(address, charity_address);
  await (await nominateNFTs).deployed();
  console.log(
    `nominateNFTs contract address is ${(await nominateNFTs).address}`
  );
}
main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

// Inheritokens contract address is 0x0cBF5eCdA58ab39d3580A434989C96d458aDBfc6
// charityContract contract address is 0x1e6dA5Ed2ce30146a0f38836501B8B7C479b9Ba9
// nominateTokens contract address is 0x7510d3bADB044735779a80b646d13f7eE831dfA1
// nominateNFTs contract address is 0x1AfacC0F9dCc5af70EB0B0eBC72F38d68fC67fBf
