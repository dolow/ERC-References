(function() {
    const state = {
        web3: null,
        contract: null,
        accounts: [],
    };
    window.state = state;

    const initDomEvent = (doc) => {
        const faucetButtonId = "faucet-button";
        const faucetValueId = "faucet-inputtext";

        const transferButtonId = "transfer-button";
        const transferReceipiantValueId = "transfer-to-inputtext";
        const transferAmountValueId = "transfer-amount-inputtext";

        doc.getElementById(faucetButtonId).onclick = () => {
            const amountStr = doc.getElementById(faucetValueId).value;
            faucet(parseInt(amountStr, 10));
        };

        doc.getElementById(transferButtonId).onclick = () => {
            const to = doc.getElementById(transferReceipiantValueId).value;
            const amountStr = doc.getElementById(transferAmountValueId).value;
            transfer(to, state.web3.utils.toWei(amountStr, "ether"));
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
                state.contract = new state.web3.eth.Contract(window.erc20SampleEnabledAbi(), contractAddress).methods;
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
        const userAddressId = "transfer-from-label";
        const balanceId = "balance-label";
        const supplyId = "totalsupply-label";
        const nameClass = "name-label";
        const symbolClass = "symbol-label";

        refreshContract()
            .then(([contract, accounts]) => {
                document.getElementById(userAddressId).textContent =  accounts[0];
                return Promise.all([
                    contract.balanceOf(accounts[0]).call({from: accounts[0]}),
                    contract.decimals().call({from: accounts[0]}),
                    contract.totalSupply().call({from: accounts[0]}),
                    contract.name().call({from: accounts[0]}),
                    contract.symbol().call({from: accounts[0]}),
                ]).then(([balance, decimals, supply, name, symbol]) => {
                    document.getElementById(balanceId).textContent = `${balance / (10 ** decimals)}`;
                    document.getElementById(supplyId).textContent = `${supply / (10 ** decimals)}`;
                    const nameElems = document.getElementsByClassName(nameClass);
                    for (let i = 0; i < nameElems.length; i += 1) {
                        nameElems[i].innerText = name;
                    }
                    const symbolElems = document.getElementsByClassName(symbolClass);
                    for (let i = 0; i < symbolElems.length; i += 1) {
                        symbolElems[i].innerText = symbol;
                    }
                });
            });
    };

    const faucet = async (amount) => {
        refreshContract()
            .then(([contract, accounts]) => contract
                .freeMint(accounts[0], amount)
                .send({from: accounts[0]})
                .then(() => render())
            );
    };

    const transfer = async (receipiant, amount) => {
        refreshContract()
            .then(([contract, accounts]) => contract
                .transfer(receipiant, amount)
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
