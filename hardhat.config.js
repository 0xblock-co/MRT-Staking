require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// const PRIVATE_KEY = "YOUR ROPSTEN PRIVATE KEY";
const PRIVATE_KEY = "0x";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/cedb60965aa445678c19340ea4652b90",
      accounts: [PRIVATE_KEY],
    },
    // main: {
    //   url: "https://mainnet.infura.io/v3/cedb60965aa445678c19340ea4652b90",
    //   accounts: [PRIVATE_KEY],
    // }
  },
  solidity: {
    version: "0.8.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
