const Erc1155Sample = artifacts.require("Erc1155Sample");

contract("Erc1155Sample", (accounts) => {
    it ("has been deployed succcessfully", async () => {
        const deployed = await Erc1155Sample.deployed();
        assert(deployed, "contract not deployed");
    });

    context("newMintBatch", async () => {
        context("when length of recipients and amounts are the same", () => {
            it ("should mint tokens with next token id", async () => {
                const erc1155 = await Erc1155Sample.deployed();

                const expectedAccount = accounts[0];
                const expectedAmount = 10;
                const expectedTokenId = await erc1155.nextTokenId();

                const beforeBalance = await erc1155.balanceOf(expectedAccount, expectedTokenId);
                assert.equal(beforeBalance.toNumber(), 0, "must have no token");

                await erc1155.newMintBatch([expectedAccount], [expectedAmount]);

                const currentBalance = await erc1155.balanceOf(expectedAccount, expectedTokenId);
                assert.equal(currentBalance.toNumber(), expectedAmount, `must have token with amount: ${expectedAmount}`);
            });
        });

        context("when length of recipients and amounts are different", () => {
            it ("should occur error", async () => {
                const erc1155 = await Erc1155Sample.deployed();
                
                try {
                    await erc1155.newMintBatch([accounts[0]], [1, 2]);
                } catch (e) {
                    return;
                }

                assert.fail("should occur error");
            });
        });
    });

    context("mintBatch", async () => {
        let to = accounts[0];
        let tokenIds = [];
        let amounts = [];

        context("when length of token ids and amounts are the same", () => {
            it ("should mint tokens", async () => {
                const erc1155 = await Erc1155Sample.deployed();
                await erc1155.newMintBatch([to], [10]);
                const tokenId = (await erc1155.nextTokenId()) - 1;

                tokenIds = [tokenId, tokenId, tokenId];
                amounts = [10, 20, 30];

                const beforeBalance = await erc1155.balanceOf(to, tokenIds[0]);

                try {
                    await erc1155.mintBatch(to, tokenIds, amounts);
                } catch (e) {
                    assert.fail("should not occur error");
                    return;
                }

                const currentBalance = await erc1155.balanceOf(to, tokenIds[0]);
                assert(currentBalance.toNumber() > beforeBalance.toNumber(), "token should not be minted");

            });

            it ("should not occur error", async () => {
                const erc1155 = await Erc1155Sample.deployed();
                await erc1155.newMintBatch([to], [10]);
                const tokenId = (await erc1155.nextTokenId()) - 1;

                tokenIds = [tokenId, tokenId, tokenId];
                amounts = [10, 20, 30];

                try {
                    await erc1155.mintBatch(to, tokenIds, amounts);
                } catch (e) {
                    assert.fail("should not occur error");
                    return;
                }
            });
        });

        context("when length of token ids and amounts are different", () => {
            it ("should occur exception", async () => {
                tokenIds = [1, 2, 3];
                amounts = [10, 10];

                const erc1155 = await Erc1155Sample.deployed();

                try {
                    await erc1155.mintBatch(to, tokenIds, amounts);
                } catch (e) {
                    return;
                }

                assert.fail("should occur error");
            });

            it ("should not be minted", async () => {
                tokenIds = [1, 2, 3];
                amounts = [10, 10];

                const erc1155 = await Erc1155Sample.deployed();

                const beforeBalance = await erc1155.balanceOf(to, tokenIds[0]);

                try {
                    await erc1155.mintBatch(to, tokenIds, amounts);
                } catch (e) {
                    const currentBalance = await erc1155.balanceOf(to, tokenIds[0]);
                    assert.equal(currentBalance.toNumber(), beforeBalance.toNumber(), "token should not be minted");
                    return;
                }

                assert.fail("should occur error");
            });
        });
        context("when token id is already owned", async () => {
            it ("should increase token amoount", async () => {
                const erc1155 = await Erc1155Sample.deployed();
                await erc1155.newMintBatch([to], [10]);
                const tokenId = (await erc1155.nextTokenId()) - 1;

                to = accounts[1];
                tokenIds = [tokenId];
                amounts = [10];

                await erc1155.mintBatch(to, tokenIds, amounts);

                const beforeBalance = await erc1155.balanceOf(to, tokenIds[0]);

                await erc1155.mintBatch(to, tokenIds, amounts);

                const currentBalance = await erc1155.balanceOf(to, tokenIds[0]);
                assert.equal(currentBalance.toNumber(), (beforeBalance.toNumber() + amounts[0]), "amount should be increased");
            });
        });
    });

    context("mintBatchAddress", async () => {
        let recipients = [accounts[0], accounts[1]];
        let tokenIds = [[1, 2], [2, 3]];
        let amounts = [[10, 20], [20, 30]];

        context("when length of token ids and amounts are the same as recipients token", () => {
            recipients = [accounts[0], accounts[1]];
            tokenIds = [[], []];
            amounts = [[], []];

            context("when each element of token ids and amounts have the same length", () => {
                it ("should mint tokens", async () => {
                    recipients = [accounts[0], accounts[1]];
                    tokenIds = [[1, 2, 3], [3, 4]];
                    amounts = [[10, 20, 30], [30, 40]];

                    const erc1155 = await Erc1155Sample.deployed();

                    const beforeBalance = await erc1155.balanceOf(recipients[0], tokenIds[0][0]);

                    try {
                        await erc1155.mintBatchAddress(recipients, tokenIds, amounts);
                    } catch (e) {
                        assert.fail(e);
                        return;
                    }

                    const currentBalance = await erc1155.balanceOf(recipients[0], tokenIds[0][0]);
                    assert(currentBalance.toNumber() > beforeBalance.toNumber(), "token should not be minted");

                });

                it ("should not occur error", async () => {
                    recipients = [accounts[0], accounts[1]];
                    tokenIds = [[1, 2, 3], [3, 4]];
                    amounts = [[10, 20, 30], [30, 40]];

                    const erc1155 = await Erc1155Sample.deployed();

                    try {
                        await erc1155.mintBatchAddress(recipients, tokenIds, amounts);
                    } catch (e) {
                        assert.fail(e);
                        return;
                    }
                });
            });

            context("when any element of token ids and amounts have the different length form each other", () => {
                it ("should occur error", async () => {
                    recipients = [accounts[0], accounts[1]];
                    tokenIds = [[1, 2, 3], [3, 4]];
                    amounts = [[10, 20], [30, 40, 50]];

                    const erc1155 = await Erc1155Sample.deployed();

                    try {
                        await erc1155.mintBatchAddress(recipients, tokenIds, amounts);
                    } catch (e) {
                        return;
                    }

                    assert.fail("should occur error");
                });
            });
        });

        context("when the length of token ids is different from recipients length", async () => {
            recipients = [accounts[0], accounts[1]];
            tokenIds = [[1]];
            amounts = [[10, 20], [20, 30]];

            it ("should occure exception", async () => {
                const erc1155 = await Erc1155Sample.deployed();

                try {
                    await erc1155.mintBatchAddress(recipients, tokenIds, amounts);
                } catch (e) {
                    return;
                }

                assert.fail("should occure exception");
            });

            it ("should not be minted", async () => {
                const erc1155 = await Erc1155Sample.deployed();

                const beforeBalance = await erc1155.balanceOf(recipients[0], tokenIds[0][0]);

                try {
                    await erc1155.mintBatchAddress(recipients, tokenIds, amounts);
                } catch (e) {
                    const currentBalance = await erc1155.balanceOf(recipients[0], tokenIds[0][0]);
                    assert.equal(beforeBalance.toNumber(), currentBalance.toNumber())
                    return;
                }

                assert.fail("should occure exception");
            });
        });

        context("when the length of amounts is different from recipients length", async () => {
            recipients = [accounts[0], accounts[1]];
            tokenIds = [[1, 2], [2, 3]];
            amounts = [[10, 20]];

            it ("should occure exception", async () => {
                const erc1155 = await Erc1155Sample.deployed();

                try {
                    await erc1155.mintBatchAddress(recipients, tokenIds, amounts);
                } catch (e) {
                    return;
                }

                assert.fail("should occure exception");
            });

            it ("should not be minted", async () => {
                const erc1155 = await Erc1155Sample.deployed();

                const beforeBalance = await erc1155.balanceOf(recipients[0], tokenIds[0][0]);

                try {
                    await erc1155.mintBatchAddress(recipients, tokenIds, amounts);
                } catch (e) {
                    const currentBalance = await erc1155.balanceOf(recipients[0], tokenIds[0][0]);
                    assert.equal(beforeBalance.toNumber(), currentBalance.toNumber())
                    return;
                }

                assert.fail("should occure exception");
            });
        });
    });

    context("tokenExists", async () => {
        context("when token id is not owned", async () => {
            it ("should return false", async () => {
                const erc1155 = await Erc1155Sample.deployed();
                const tokenId = await erc1155.nextTokenId();
                try {
                    await erc1155.ownerOf(tokenId);
                } catch (e) {
                    assert.equal(await erc1155.tokenExists(tokenId), false);
                    return;
                }

                assert.fail("token already owned");
            });
        });

        context("when token id is already owned", async () => {
            it ("should return true", async () => {
                const erc1155 = await Erc1155Sample.deployed();
                const tokenId = await erc1155.nextTokenId();

                assert(!(await erc1155.tokenExists(tokenId)), "token already exist");

                await erc1155.newMintBatch([accounts[0]], [1]);

                assert(await erc1155.tokenExists(tokenId), "token should exist");
            });
        });
    });

    context("nextTokenId", () => {
        it ("should return not owned token id", async () => {
            const erc1155 = await Erc1155Sample.deployed();
            const tokenId = await erc1155.nextTokenId();
            assert.equal(await erc1155.tokenExists(tokenId), false);
        });
    });
});
