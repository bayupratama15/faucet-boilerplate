<template>
  <div class="relative group w-3/6">
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
          bg-gray-900
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
export default {
  data() {
    return {
      address: "",
    };
  },
  methods: {
    sendTransaction: function () {
      // const privKey =
      //   "b635cd30983e9d8cc530eb27d0988d3ef1e87d97cd6bf845ae25f4d619fa257c";
      // const addressFrom = "0xae43bebd1cb0f377a433846cdfb810d28ca189a5";
      // const web3 = new Web3(
      //   new Web3.providers.HttpProvider("http://localhost:8545")
      // );
      // // await web3.eth.accounts.signTransaction(
      // //   {
      // //     from: addressFrom,
      // //     to: this.address,
      // //     value: web3.utils.toWei("10", "ether"),
      // //     gas: "1000000",
      // //   },
      // //   privKey
      // // );
      // try {
      //   await web3.eth.sendSignedTransaction(
      //     "0x" +
      //       web3.eth.accounts
      //         .signTransaction(
      //           {
      //             from: addressFrom,
      //             to: this.address,
      //             value: web3.utils.toWei("10", "ether"),
      //             gas: "1000000",
      //           },
      //           privKey
      //         )
      //         .rawTransaction.toString("hex")
      //   );
      //   console.log("Transaction sent!", this.address);
      // } catch (error) {
      //   console.log(error);
      // }
    },
  },
};
</script>
