const Erc721Sample = artifacts.require("Erc721Sample");

contract("Erc721Sample", (accounts) => {
    it ("has been deployed succcessfully", async () => {
        const deployed = await Erc721Sample.deployed();
        assert(deployed, "contract not deployed");
    });

    context("mint", async () => {
        context("when token id is not exist", () => {
            it ("should not occur exception", async () => {
                const erc721 = await Erc721Sample.deployed();
                const tokenId = await erc721.nextTokenId();
                try {
                    await erc721.mint(accounts[0], tokenId);
                } catch (e) {
                    assert.fail(e);
                }
            });
            it ("should move ownership to given address", async () => {
                const erc721 = await Erc721Sample.deployed();
                const expectAccount = accounts[0];
                const tokenId = await erc721.nextTokenId();

                try {
                    await erc721.ownerOf(tokenId)
                } catch (e) {
                    await erc721.mint(expectAccount, tokenId);

                    const currentOwner = await erc721.ownerOf(tokenId)
                    assert.equal(currentOwner, expectAccount);
                    return;
                }

                assert.fail("token already minted");
            });
        });
        context("when token id is already owned", async () => {
            it ("should occur exception", async () => {
                const erc721 = await Erc721Sample.deployed();
                const tokenId = await erc721.nextTokenId();
                await erc721.mint(accounts[0], tokenId);
                try {
                    await erc721.ownerOf(tokenId);
                } catch (e) {
                    assert.fail("token is not owned");
                }

                try {
                    await erc721.mint(accounts[0], tokenId);
                } catch (e) {
                    return;
                }
                assert.fail("should occur error");
            });
        });
    });

    context("tokenExists", async () => {
        context("when token id is not owned", async () => {
            it ("should return false", async () => {
                const erc721 = await Erc721Sample.deployed();
                const tokenId = await erc721.nextTokenId();
                try {
                    await erc721.ownerOf(tokenId);
                } catch (e) {
                    assert.equal(await erc721.tokenExists(tokenId), false);
                    return;
                }

                assert.fail("token already owned");
            });
        });

        context("when token id is already owned", async () => {
            it ("should return true", async () => {
                const erc721 = await Erc721Sample.deployed();
                const tokenId = await erc721.nextTokenId();
                await erc721.mint(accounts[0], tokenId);
                try {
                    await erc721.ownerOf(tokenId);
                } catch (e) {
                    assert.fail("token is not owned");
                }

                assert.equal(await erc721.tokenExists(tokenId), true);
            });
        });
    });

    context("nextTokenId", () => {
        it ("should return not owned token id", async () => {
            const erc721 = await Erc721Sample.deployed();
            const tokenId = await erc721.nextTokenId();
            assert.equal(await erc721.tokenExists(tokenId), false);
        });
    });

    context("getTokenUri", () => {
        context("when token uri is not passed", () => {
            it ("should return empty string", async () => {
                const erc721 = await Erc721Sample.deployed();
                const tokenId = await erc721.nextTokenId();
                await erc721.mint(accounts[0], tokenId);

                const expectUri = "";
                const actualUri = await erc721.getTokenUri(tokenId);
                assert.equal(expectUri, actualUri);
            });
        });
        context("when token uri is registered as not empty string", () => {
            it ("should return registered uri", async () => {
                const expectUri = "https://www.google.com";
                const erc721 = await Erc721Sample.deployed();
                const tokenId = await erc721.nextTokenId();
                await erc721.mint(accounts[0], tokenId, expectUri);

                const actualUri = await erc721.getTokenUri(tokenId);
                assert.equal(expectUri, actualUri);
            });
        });
    });
});
