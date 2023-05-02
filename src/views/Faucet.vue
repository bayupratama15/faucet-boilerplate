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
    class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
  >
    <div class="relative py-3 sm:max-w-xl sm:mx-auto w-full sm:w-3/4">
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
      ></div>
      <div
        class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
      >
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold">Faucet Numerix Chain</h1>
          </div>
          <div class="divide-y divide-gray-200">
            <div
              class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <div class="relative">
                <input
                  autocomplete="off"
                  id="address"
                  name="address"
                  type="text"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  placeholder="0x0000000000000000000000000000000000000000"
                  v-model="address"
                />
                <label
                  for="address"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Address</label
                >
              </div>
              <div class="relative">
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
    // DETECTION OF NETWORK IF NOT ON Numerix Chain Testnet THEN ADD CHAIN ON METAMASK
    window.ethereum.on("chainChanged", (chainId) => {
      console.log(chainId);
      if (chainId === "0xff3d") {
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
      if (chainId !== "0xff3d") {
        Swal.fire({
          title: "Please add Numerix Chain Testnet",
          text: "Please add Numerix Chain Testnet to your metamask",
          icon: "warning",
          confirmButtonText: "Add Numerix Chain Testnet",
        }).then((result) => {
          if (result.isConfirmed) {
            window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xff3d",
                  chainName: "NUM  Testnet",
                  nativeCurrency: {
                    name: "NUM",
                    symbol: "NUM",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.numerixchain.com/"],
                  blockExplorerUrls: ["https://explorer.numerixchain.com//"],
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
    // if chainid is not 0xff3d then add chain on metamask
    if (chainId !== "0xff3d") {
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
        new Web3.providers.HttpProvider("https://rpc.numerixchain.com/")
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
            `https://explorer.numerixchain.com//tx/${receipt.transactionHash}`,
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
            chainId: "0xff3d",
            chainName: "Numerix Chain Testnet",
            nativeCurrency: {
              name: "NUM",
              symbol: "NUM",
              decimals: 9,
            },
            rpcUrls: ["https://rpc.numerixchain.com/"],
            blockExplorerUrls: ["https://explorer.numerixchain.com//"],
          },
        ],
      });
    },
  },
};
</script>
