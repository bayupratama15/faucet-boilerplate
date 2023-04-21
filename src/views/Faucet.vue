<template>
  <div
    v-if="loading"
    class="flex justify-center items-center h-screen fixed top-0 left-0 right-0 bottom-0 w-full z-50 overflow-hidden bg-gray-700 opacity-75"
  >
    <div
      class="spinner-border animate-spin inline-block w-8 h-8 rounded-full"
      role="status"
    >
      <span class="visually-hidden">
        <svg
          className="animate-spin -inline-block w-8 h-8 border-4 rounded-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </span>
    </div>
  </div>
  <div
    class="container mx-auto p-6 bg-blue-900 flex h-screen justify-center items-center"
  >
    <div class="flex-1 p-4">
      <div
        class="card w-full h-full bg-transparent hover:bg-gradient-to-r hover: hover:to-[#b2eff7] transition hover:rounded-lg hover:drop-shadow-3xl hover:ease-in-out"
      >
        <div
          class="block h-full overflow-hidden rounded-lg border bg-gradient-to-r from-[#ffa0ae,5%] to-[#b2eff7] opacity-90 shadow-md transition ease-in-out hover:cursor-pointer hover:from-[#ffa0ae,5%] hover:to-[#b2eff7] hover:opacity-100 hover:transition hover:duration-500 sm:flex-row"
        >
          <div class="p-4 sm:ml-16 md:ml-32 lg:ml-0">
            <!-- heading -->
            <div class="-mx-2 flex flex-wrap text-center sm:mx-auto sm:mb-2">
              <div class="p-2">
                <div
                  class="flex h-full items-center justify-center rounded-lg p-4"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    class="mr-4 h-6 w-6 flex-shrink-0 text-indigo-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                  </svg>
                  <span
                    class="title-font text-lg font-bold tracking-wide text-blue-900"
                  >
                    Faucet Layer
                  </span>
                </div>
              </div>
            </div>
            <div class="lg:px-4 lg:pb-2">
              <div class="flex flex-wrap -mx-3 mb-6 ml-1">
                <span class="text-gray-700 text-sm font-bold"
                  >Enter your address to get 10 tokens</span
                >
              </div>
              <!-- FORM INPUT WITH BUTTON -->
              <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-password"
                  >
                    Address
                  </label>
                  <input
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-password"
                    type="text"
                    placeholder="0x0000000000000000000000000000000000000000"
                    v-model="address"
                  />
                  <p class="text-gray-600 text-xs italic">
                    Please enter your address
                  </p>
                </div>
              </div>
              <!-- BUTTON -->
              <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                  <button
                    v-if="btnTransaction"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded animate-bounce"
                    @click="sendTransaction()"
                  >
                    Get Tokens
                  </button>
                  <button
                    v-if="btnMetamask"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded animate-bounce"
                    @click="connectMetamask"
                  >
                    Add to Metamask
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      address: "",
      loading: false,
      btnTransaction: true,
      btnMetamask: false,
    };
  },
  async mounted() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error(error);
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545/")
      );
    }
    this.getAccount();
    window.ethereum.on("accountsChanged", (accounts) => {
      this.getAccount();
    });
    // DETECTION OF NETWORK IF NOT ON Layer Testnet THEN ADD CHAIN ON METAMASK
    window.ethereum.on("chainChanged", (chainId) => {
      console.log(chainId);
      if (chainId === "0x107d7") {
        Swal.fire({
          icon: "success",
          title: "You are on the right network",
          showConfirmButton: true,
          timer: 1500,
        });
        this.getAccount();
        this.btnTransaction = true;
        this.btnMetamask = false;
      }
      if (chainId !== "0x107d7") {
        Swal.fire({
          title: "Please add Layer Testnet",
          text: "Please add Layer Testnet to your metamask",
          icon: "warning",
          confirmButtonText: "Add Layer Testnet",
        }).then((result) => {
          if (result.isConfirmed) {
            window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x107d7",
                  chainName: "Layer  Testnet",
                  nativeCurrency: {
                    name: "Layer",
                    symbol: "Layer",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpctestnet.layernetwork.org/"],
                  blockExplorerUrls: ["https://explorer.layernetwork.org/"],
                },
              ],
            });
          }
        });
      }
    });
    // GET CHAIN ID
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    console.log(chainId);
    // if chainid is not 0x107d7 then add chain on metamask
    if (chainId !== "0x107d7") {
      this.btnTransaction = false;
      this.btnMetamask = true;
    } else {
      this.btnTransaction = true;
      this.btnMetamask = false;
    }
  },
  methods: {
    async getAccount() {
      const accounts = await window.web3.eth.getAccounts();
      this.address = accounts[0];
    },
    async sendTransaction() {
      if (this.address == "") {
        Swal.fire({
          title: "Error",
          text: "Please enter an address",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      this.loading = true;
      const privKey =
        "a347ce51e190978f4103e0b3bb5ac8a1675e641afe70b0af3115023c3c44407b";
      const addressFrom = "0x42Cfc422E2c078759eb252ba72E9578479679826";
      const web3 = new Web3(
        new Web3.providers.HttpProvider("https://rpctestnet.layernetwork.org/")
      );
      try {
        const nonce = await web3.eth.getTransactionCount(addressFrom);
        console.log(nonce);
        const tx = {
          nonce: web3.utils.toHex(nonce),
          gasLimit: web3.utils.toHex(1000000),
          gasPrice: web3.utils.toHex(web3.utils.toWei("1", "gwei")),
          to: this.address,
          value: web3.utils.toHex(web3.utils.toWei("10", "ether")),
        };
        const signedTx = await web3.eth.accounts.signTransaction(tx, privKey);
        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );
        console.log(receipt);
        this.loading = false;
        Swal.fire({
          title: "Success",
          text: "Transaction sent ",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // redirect to tx page target="_blank"
          window.open(
            `https://explorer.layernetwork.org/tx/${receipt.transactionHash}`,
            "_blank"
          );
        });
      } catch (error) {
        this.loading = false;
        Swal.fire({
          title: "Error",
          text: `Transaction failed,${error}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
    // ADD CRYON TOKEN TO METAMASK
    async connectMetamask() {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x107d7",
            chainName: "Layer Network Testnet",
            nativeCurrency: {
              name: "Layer",
              symbol: "Layer",
              decimals: 9,
            },
            rpcUrls: ["https://rpctestnet.layernetwork.org/"],
            blockExplorerUrls: ["https://explorer.layernetwork.org/"],
          },
        ],
      });
    },
  },
};
</script>
