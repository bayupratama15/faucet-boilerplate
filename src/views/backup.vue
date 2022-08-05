<template>
  <div class="mx-auto container flex justify-center py-16 px-4">
    <!-- Loading -->
    <div
      v-if="loading"
      class="
        flex
        justify-center
        items-center
        h-screen
        fixed
        top-0
        left-0
        right-0
        bottom-0
        w-full
        z-50
        overflow-hidden
        bg-gray-700
        opacity-75
      "
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
    <!-- Loading -->
    <div
      class="
        p-4
        max-w-sm
        bg-white
        rounded-lg
        border border-gray-200
        shadow-md
        sm:p-6
        md:p-8
        dark:bg-gray-800 dark:border-gray-700
        w-full
        mt-40
      "
    >
      <div class="space-y-6">
        <h5
          class="text-xl font-medium text-gray-900 dark:text-white text-center"
        >
          Faucet Request
        </h5>
        <div>
          <label
            for="address"
            class="
              block
              mb-2
              text-sm
              font-medium
              text-gray-900
              dark:text-gray-300
            "
            >Your Address</label
          >
          <input
            type="text"
            name="address"
            id="address"
            class="
              bg-gray-50
              border border-gray-300
              text-gray-900 text-sm
              rounded-lg
              focus:ring-blue-500 focus:border-blue-500
              block
              w-full
              p-2.5
              dark:bg-gray-600
              dark:border-gray-500
              dark:placeholder-gray-400
              dark:text-white
            "
            placeholder="0xae43bebd1cb0f377a433846cdfb810d28ca189a5"
            required=""
            v-model="address"
          />
        </div>
        <button
          class="
            w-full
            text-white
            bg-blue-700
            hover:bg-blue-800
            focus:ring-4 focus:outline-none focus:ring-blue-300
            font-medium
            rounded-lg
            text-sm
            px-5
            py-2.5
            text-center
            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
          "
          @click="sendTransaction"
        >
          Give Me 1 BREW
        </button>
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
        new Web3.providers.HttpProvider("https://rpc.brewhost.org/")
      );
    }
    this.getAccount();
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
        "b635cd30983e9d8cc530eb27d0988d3ef1e87d97cd6bf845ae25f4d619fa257c";
      const addressFrom = "0xae43bebd1cb0f377a433846cdfb810d28ca189a5";
      const web3 = new Web3(
        new Web3.providers.HttpProvider("https://rpc.brewhost.org/")
      );
      try {
        const nonce = await web3.eth.getTransactionCount(addressFrom);
        console.log(nonce);
        const tx = {
          nonce: web3.utils.toHex(nonce),
          gasLimit: web3.utils.toHex(1000000),
          gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
          to: this.address,
          value: web3.utils.toHex(web3.utils.toWei("1", "ether")),
          data: "0x",
        };
        const signedTx = await web3.eth.accounts.signTransaction(tx, privKey);
        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );
        this.loading = false;
        Swal.fire({
          title: "Success",
          text: "Transaction sent",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        this.loading = false;
        Swal.fire({
          title: "Error",
          text: "Transaction failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      // await web3.eth.accounts
      //   .signTransaction(
      //     {
      //       from: addressFrom,
      //       to: this.address,
      //       value: web3.utils.toWei("10", "ether"),
      //       gas: "21000",
      //     },
      //     privKey
      //   )
      //   .then((signedTx) => {
      //     web3.eth
      //       .sendSignedTransaction(signedTx.rawTransaction)
      //       .on("receipt", (receipt) => {
      //         Swal.fire({
      //           title: "Success!",
      //           text: "Transaction has been sent.",
      //           icon: "success",
      //         });
      //         this.loading = false;
      //         console.log(receipt);
      //       });
      //   });
    },
  },
};
</script>
