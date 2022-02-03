(function() {
    const state = {
        web3: null,
        contract: null,
        accounts: [],
    };
    window.state = state;

    const initDomEvent = (doc) => {
        const mintButtonId = "mint-button";
        const mintValueId = "mint-inputtext";

        const transferButtonId = "transfer-button";
        const transferSenderValueId = "transfer-from-inputtext";
        const transferReceipiantValueId = "transfer-to-inputtext";
        const transferAmountValueId = "transfer-amount-inputtext";

        doc.getElementById(mintButtonId).onclick = () => {
            const url = doc.getElementById(mintValueId).value;
            mint(url);
        };

        doc.getElementById(transferButtonId).onclick = () => {
            const from = doc.getElementById(transferSenderValueId).value;
            const to = doc.getElementById(transferReceipiantValueId).value;
            const tokenId = doc.getElementById(transferAmountValueId).value;
            transfer(from, to, parseInt(tokenId, 10));
        };
    };

    const initEtherium = async () => {
        state.web3 = new Web3(window.ethereum);
        window.ethereum.on('accountsChanged', (accounts) => {
            render();
        });
    };

    const refreshContract = () => {
        const contractAddressId = "contractaddress-inputtext";

        return Promise.all([
            // contract
            new Promise((resolve) => {
                const contractAddress = document.getElementById(contractAddressId).value;
                state.contract = new state.web3.eth.Contract(window.erc721SampleEnabledAbi(), contractAddress).methods;
                resolve(state.contract);
            }),
            // accounts
            new Promise((resolve) => {
                window.ethereum
                    .request({ method: 'eth_requestAccounts' })
                    .then(accounts => {
                        state.accounts = accounts;
                        resolve(state.accounts);
                    })
                    .catch((error) => {
                        if (error.code === 4001) {
                            // EIP-1193 userRejectedRequest error
                            console.log('Please connect to Wallet.');
                        } else {
                            console.error(error);
                        }
                    });
            }),
        ]);
    };

    const render = async () => {
        const userAddressId = "transfer-from-inputtext";
        const balanceId = "balance-label";
        const nameClass = "name-label";
        const symbolClass = "symbol-label";
        const tokenIdsId = "tokenids-label";

        refreshContract()
            .then(async ([contract, accounts]) => {
                document.getElementById(userAddressId).value = accounts[0];

                const nextTokenId = await contract.nextTokenId().call({from:accounts[0]});

                return Promise.all([
                    contract.balanceOf(accounts[0]).call({from: accounts[0]}),
                    contract.name().call({from: accounts[0]}),
                    contract.symbol().call({from: accounts[0]}),
                    new Promise(async (resolve) => {
                        const ownedTokenIds = [];
                        for (let i = 1; i < nextTokenId; i++) {
                            const owner = await contract.ownerOf(i).call({from: accounts[0]});
                            if (owner.toLowerCase() === accounts[0].toLowerCase()) {
                                ownedTokenIds.push(i);
                            }
                        }
                        resolve(ownedTokenIds);
                    }),
                ]).then(async ([balance, name, symbol, ownedTokenIds]) => {
                    document.getElementById(balanceId).textContent =  `${balance}`;
                    const nameElems = document.getElementsByClassName(nameClass);
                    for (let i = 0; i < nameElems.length; i += 1) {
                        nameElems[i].innerText = name;
                    }
                    const symbolElems = document.getElementsByClassName(symbolClass);
                    for (let i = 0; i < symbolElems.length; i += 1) {
                        symbolElems[i].innerText = symbol;
                    }

                    const tokenIdsDom = document.getElementById(tokenIdsId);
                    tokenIdsDom.innerHTML = "";
                    for (let i = 0; i < ownedTokenIds.length; i++) {
                        const tokenId = ownedTokenIds[i];
                        const tokenUrl = await contract.getTokenUri(tokenId).call({from: accounts[0]});
                        const li = document.createElement("li");
                        li.innerText = `${tokenId}: ${tokenUrl}`;
                        tokenIdsDom.appendChild(li);
                    }
                });
            });
    };

    const mint = async (url) => {
        refreshContract()
            .then(async ([contract, accounts]) => contract
                .nextTokenId()
                .call({from: accounts[0]})
                .then(tokenId => contract
                    .mint(accounts[0], tokenId, url)
                    .send({from: accounts[0]})
                    .then(() => render())
                )
            );
    };

    const transfer = async (sender, receipiant, tokenId) => {
        refreshContract()
            .then(([contract, accounts]) => contract
                .transferFrom(sender, receipiant, tokenId)
                .send({from: accounts[0]})
                .then(() => render())
            );
    };

    window.onload = async () => {
        initDomEvent(window.document);
        await initEtherium();
        render();
    };
})();
