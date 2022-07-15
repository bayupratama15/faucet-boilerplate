<template>
  <div class="relative group w-3/6">
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
        animate-tilt
        transition
        group-hover:duration-200
        duration-500
        group-hover:opacity-100
        opacity-75
        absolute
        rounded-lg
        -inset-0.5
        bg-gradient-to-r
        from-green-300
        via-indigo-700
        to-pink-500
        filter
        blur
        w-full
      "
    ></div>
    <div
      class="
        relative
        flex
        items-center
        py-4
        leading-none
        bg-black
        divide-x divide-gray-600
        rounded-lg
        px-7
      "
    >
      <input
        class="
          w-full
          px-4
          py-2
          text-white-100
          border-2 border-gray-900
          rounded-lg
          placeholder-white-100
          focus:outline-none
          focus:border-sky-500
          focus:ring-1
          focus:ring-sky-500
          focus:border-white-100
          focus:bg-gray-100
        "
        type="text"
        v-model="address"
        placeholder="Enter your address"
      />
      <button
        class="
          pl-6
          text-indigo-400
          transition
          duration-200
          group-hover:text-gray-100
        "
        @click="sendTransaction"
      >
        Give ME 10
      </button>
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
        new Web3.providers.HttpProvider("http://localhost:8545")
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
      this.loading = true;
      const privKey =
        "b635cd30983e9d8cc530eb27d0988d3ef1e87d97cd6bf845ae25f4d619fa257c";
      const addressFrom = "0xae43bebd1cb0f377a433846cdfb810d28ca189a5";
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
      );
      await web3.eth.accounts
        .signTransaction(
          {
            from: addressFrom,
            to: this.address,
            value: web3.utils.toWei("10", "ether"),
            gas: "21000",
          },
          privKey
        )
        .then((signedTx) => {
          web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .on("receipt", (receipt) => {
              Swal.fire({
                title: "Success!",
                text: "Transaction has been sent.",
                icon: "success",
              });
              this.loading = false;
              console.log(receipt);
            });
        });
    },
  },
};
</script>
