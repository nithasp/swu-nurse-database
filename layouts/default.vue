<template>
   <Header v-if="!isLoading" />
   <div
      v-if="!isLoading"
      :class="[fullSidebar ? '!grid-cols-[250px_1fr]' : '!grid-cols-[66px_1fr]', 'grid grid-cols-[66px_1fr] sm:grid-cols-[250px_1fr] transition-all']"
      id="swu-body"
   >
      <Sidebar id="swu-sidebar" :fullSidebar="fullSidebar" :setNavbar="setNavbar" />
      <main id="swu-main" class="pl-4 h-[calc(100vh-98px)] overflow-hidden">
         <div class="bg-gray-50 h-full rounded-l-[40px] p-4 overflow-auto">
            <slot />
         </div>
      </main>
   </div>
   <Loading v-if="isLoading" />
</template>
<script setup>
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import useAuthAPI from "~/service/api/auth";
import Loading from "~/components/loading";
const { fetchProfileInfo } = useAuthAPI;
import { useProfileStore } from "@/stores/index";
const store = useProfileStore();

const fullSidebar = ref(true);

const setNavbar = (status) => {
   fullSidebar.value = status;
};

const isLoading = ref(true);
onMounted(() => {
   window.addEventListener("resize", onResize);
   getProfileInfo();
});

const getProfileInfo = async () => {
   isLoading.value = true;
   const res = await fetchProfileInfo();
   if (res.code == 20000) {
      store.setProfile(res.responseObject.profile);
   }
   isLoading.value = false;
};

let smWidth = false;
const onResize = () => {
   if (window.innerWidth < 640) {
      if (!smWidth) {
         fullSidebar.value = false;
      }
      smWidth = true;
   } else {
      smWidth = false;
   }
};
</script>
