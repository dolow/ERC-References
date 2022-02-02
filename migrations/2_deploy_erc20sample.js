const Erc20Sample = artifacts.require("Erc20Sample");

module.exports = function (deployer) {
    return deployer.deploy(Erc20Sample);
};
