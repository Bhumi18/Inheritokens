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

// Inheritokens contract address is 0xEDB21676F2d4fe4A78B7695DDF3cE9641428947B
// charityContract contract address is 0x0f039156F2faB025dD0d49903CC7b0AAEA8B9531
// multiplePriorityNominee contract address is 0x4aA85be6836Aa1440896283B14F85739d3269418
