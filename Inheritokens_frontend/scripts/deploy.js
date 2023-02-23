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

// Inheritokens contract address is 0xFD1aBc6527d4e12aD6845de502F6Da1134f6BAF5
// charityContract contract address is 0x733A11b0cdBf8931614C4416548B74eeA1fbd0A4
// multipleNominee contract address is 0xfDbD937a5CaB7eF3520D063c7742E0A387336708