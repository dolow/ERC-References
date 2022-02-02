(function() {
    const state = {
        web3: null,
        contract: null,
        accounts: [],
    };
    window.state = state;

    const contract = (reload = false) => {
        if (!state.contract || reload === true) {
            const contractAddress = document.getElementById("contractaddress-inputtext").value;
            state.contract = new state.web3.eth.Contract(window.erc20SampleEnabledAbi(), contractAddress).methods;
        }
        return state.contract;
    };

    const getAccounts = async (reload = false) => {
        if (state.accounts.length === 0 || reload === true) {
            state.accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        return state.accounts;
    };

    const initEvent = (doc) => {
        const freemintButtonId = "freemint-button";
        const freemintValueId = "freemint-inputtext";
        doc.getElementById(freemintButtonId).onclick = () => {
            const amountStr = doc.getElementById(freemintValueId).value;
            freeMint(parseInt(amountStr, 10));
        };
    };

    const initEtherium = async () => {
        window.ethereum.enable();
        state.web3 = new Web3(window.ethereum);
    };

    const refresh = async () => {
        const account = (await getAccounts())[0];
        const balance = await contract().balanceOf(account).call({from: account});
        const decimals = await contract().decimals().call({from: account});
        document.getElementById("balance-label").textContent =  `${balance / (10 ** decimals)}`;
    };

    const freeMint = async (amount) => {
        const account = (await getAccounts())[0];
        contract()
          .freeMint(account, amount)
          .send({from: account})
          .then(() => refresh());
    };

    window.onload = async () => {
        initEvent(window.document);
        await initEtherium();
        await refresh();
    };
})();
