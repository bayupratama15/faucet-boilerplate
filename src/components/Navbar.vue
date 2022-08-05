<template>
  <Disclosure as="nav" class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div
          class="absolute inset-y-0 left-0 flex items-center sm:hidden"
        ></div>
        <div
          class="
            flex-1 flex
            items-center
            justify-center
            sm:items-stretch sm:justify-start
          "
        >
          <div class="flex-shrink-0 flex items-center">
            <img
              class="block lg:hidden h-8 w-auto"
              src="/brewhost_text.svg"
              alt="Brewhost"
            />
            <img
              class="hidden lg:block h-8 w-auto"
              src="/brewhost_text.svg"
              alt="Brewhost"
            />
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/vue/outline";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
const imageUrl = new URL("./assets/brewhost_text.svg", import.meta.url).href;
</script>