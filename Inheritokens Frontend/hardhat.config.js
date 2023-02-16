/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      chainId: 80001,
      url: "https://polygon-mumbai.g.alchemy.com/v2/3ohLMSxKL3LyiT3ppE7-raO4PAOgbX-b",
      accounts: [
        "0xbc34a6b7f9d5c5277728b68b494bf4a095af70c2e46061e5a7ae30161db021a2",
      ],
    },
  },
};
