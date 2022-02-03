const Erc721Sample = artifacts.require("Erc721Sample");

module.exports = function (deployer) {
    return deployer.deploy(Erc721Sample);
};
