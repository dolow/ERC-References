const Erc20Sample = artifacts.require("Erc20Sample");

contract("Erc20Sample", (accounts) => {
    it ("has been deployed succcessfully", async () => {
        const deployed = await Erc20Sample.deployed();
        assert(deployed, "contract not deployed");
    });

    context("freeMint", () => {
        it ("should mint token for any value, any address", async () => {
            const erc20 = await Erc20Sample.deployed();

            const targetAccount = accounts[1];
            const amount = 100;

            const beforeNTBalance = await erc20.balanceOf(targetAccount);
            await erc20.freeMint(targetAccount, amount);
            const actualNTBalance = await erc20.balanceOf(targetAccount);

            const expectedBalance = web3.utils.toWei(`${amount}`, 'ether');
            assert.equal(web3.utils.toBN(expectedBalance).toString(), actualNTBalance.toString(), "Nice token is different");
        });
    });
});
