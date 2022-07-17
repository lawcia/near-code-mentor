import * as nearApi from "near-api-js";

export const config = {
    networkId: "default",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    headers: {

    },
    deps: {
        keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
    },
};

(async function () {
    window.near = await nearApi.connect(config);
    window.walletConnection = new nearApi.WalletConnection(window.near, APP_KEY_PREFIX);
})(window);


export const SMART_CONTRACT = process.env.REACT_APP_SMART_CONTRACT || "code_mentor.code_mentor.testnet";
export const APP_KEY_PREFIX = "code_mentor";
