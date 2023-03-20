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

// Inheritokens contract address is 0x62Df331E79c086c34ddaC03083EF5f75Ae4E30C9
// charityContract contract address is 0x3ED2C92c7c8Bf3e58B10c179E77e20e0E6031EDB
// nominateTokens contract address is 0x3fE3df775ABeC304467a3eDaB5E2260d05C72D8a
// nominateNFTs contract address is 0x58D9512Ef1C325AeaD2c2A3f6bF3b56aB05c8e1E
