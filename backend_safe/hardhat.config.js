require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,    // ton endpoint RPC Sepolia (Infura/Alchemy/QuickNode)
      accounts: [process.env.PRIVATE_KEY], // clé privée de ton wallet deployer (en .env)
    },
  },
};
