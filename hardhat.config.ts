import * as env from 'dotenv';
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

env.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ]
  },

  networks: {
    goerli: {
      accounts: process.env.TEST_PRIVATE_KEY
        ? [`0x${process.env.TEST_PRIVATE_KEY}`]
        : [],
      url: "https://goerli.infura.io/v3/fa959ead3761429bafa6995a4b25397e",
    },
  },
  etherscan: {
    apiKey: "FZ1ANB251FC8ISFDXFGFCUDCANSJNWPF9Q",
  },
  typechain: {
    outDir: "typechain",
  },
};

export default config;
