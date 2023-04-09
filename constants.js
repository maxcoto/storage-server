const constants = {
    networks: {
      mainnet: {
        suffix: "",
        subdomain: "mainnet",
      },
      goerli: {
        suffix: "goerli:",
        subdomain: "goerli",
      },
      sepolia: {
        suffix: "sepolia:",
        subdomain: "sepolia",
      },
      polygon: {
        suffix: "polygon:",
        subdomain: "polygon-mainnet",
      },
      polygon_goerli: {
        suffix: "polygon-goerli:",
        subdomain: "polygon-goerli",
      },
      arbitrum: {
        suffix: "arb:",
        subdomain: "arbitrum-mainnet",
      },
      arbitrum_goerli: {
        suffix: "arb-goerli:",
        subdomain: "arbitrum-goerli",
      },
    }
  };

  module.exports = {
    ...constants
  };
  