module.exports = {
  contracts_build_directory: './client/src/contracts',

  networks: {
    geth: {
      host: "localhost",
      port: 8545,
      network_id: "10",
    },
  },

  mocha: {
  },

  compilers: {
    solc: {
      version: "0.8.10",
    }
  },
};
