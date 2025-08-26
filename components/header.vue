<template>
   <header id="swu-header" class="h-[98px] flex justify-between items-center px-8">
      <div class="flex items-center gap-x-9">
         <div class="relative">
            <img :src="Logo" alt="SWU Logo" class="w-[198px]" />
            <span class="text-xs absolute bottom-0 right-0 text-gray-500">Version {{ config.public.version }}</span>
         </div>
         <div class="hidden min-[1250px]:block">
            <p class="font-srinakharinwirot text-[22px] leading-5">ระบบเพื่อการบริหารและตัดสินใจ คณะพยาบาลศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ</p>
            <p>ยินดีต้อนรับ admin ระดับการเข้าใช้งาน admin</p>
         </div>
      </div>
      <UDropdown
         :items="items"
         :popper="{ placement: 'bottom-start' }"
         :ui="{
            ring: 'ring-gray-50',
            divide: 'divide-gray-100',
            item: {
               active: 'bg-gray-50',
            },
         }"
         class="sm:hidden"
      >
         <template #item="{ item }">
            <!-- <PencilIcon v-if="item.id == 'edit'" />
            <LockIcon v-if="item.id == 'lock'" /> -->
            <LogoutIcon v-if="item.id == 'logout'" />
            <span class="truncate">{{ item.label }}</span>
         </template>
         <div class="rounded-full sm:bg-primary-50 h-[46px] cursor-pointer">
            <div class="flex items-center gap-x-3">
               <img :src="Avatar" alt="Avatar User" width="46" height="46" />
               <div class="hidden sm:block bg-primary-50 rounded-full min-w-[160px]">
                  <p class="font-sarabun-bold leading-5 text-sm">{{ store.profileUser.firstname }} {{ store.profileUser.lastname }}</p>
                  <p class="leading-5 text-sm">{{ store.profileUser.email }}</p>
               </div>
            </div>
         </div>
      </UDropdown>
      <div class="rounded-full sm:bg-primary-50 h-[46px] pe-2 hidden sm:block">
         <div class="flex items-center gap-x-3">
            <img :src="Avatar" alt="Avatar User" width="46" height="46" />
            <div class="hidden sm:block bg-primary-50 rounded-full">
               <p class="font-sarabun-bold leading-5 text-xs">{{ store.profileUser.firstname }} {{ store.profileUser.lastname }}</p>
               <p class="leading-5 text-xs">{{ store.profileUser.email }}</p>
            </div>
            <div class="flex rounded-[60px] p-2 bg-white gap-x-2 cursor-pointer" @click="setDialog(true)">
               <LogoutIcon />
               <p class="text-xs">ออกจากระบบ</p>
            </div>
         </div>
      </div>
   </header>
   <DialogConfirm :isOpen="isOpen" :setDialog="setDialog" title="ออกจากระบบ" desc="คุณต้องการออกจากระบบใช่หรือไม่" icon="warning" :btnAction="fnLogout" />
   <!-- <DialogEditProfile :isOpen="isOpenEditProfile" :setDialog="setDialogEditProfile" />
   <DialogChangePassword :isOpen="isOpenChangePassword" :setDialog="setDialogChangePassword" /> -->
   <Loading v-if="isLoading" />
</template>

<script setup>
import Logo from "~/assets/images/logo.png";
import Avatar from "~/assets/images/header/avatar.png";
import DialogConfirm from "~/components/dialog/confirm";
// import DialogEditProfile from "~/components/dialog/profile/editProfile";
// import DialogChangePassword from "~/components/dialog/profile/changePassword";
// import PencilIcon from "~/assets/icons/pencil";
// import LockIcon from "~/assets/icons/lock";
import LogoutIcon from "~/assets/icons/logout";
import Loading from "~/components/loading";
import useAuthAPI from "~/service/api/auth";
const { logout } = useAuthAPI;
import { useProfileStore } from "@/stores/index";
const store = useProfileStore();

const config = useRuntimeConfig();

const items = [
   // [
   //    {
   //       id: "edit",
   //       label: "แก้ไขโปรไฟล์",
   //       click: () => {
   //          setDialogEditProfile(true);
   //       },
   //    },
   //    {
   //       id: "lock",
   //       label: "เปลี่ยนรหัสผ่าน",
   //       click: () => {
   //          setDialogChangePassword(true);
   //       },
   //    },
   // ],
   [
      {
         id: "logout",
         label: "ออกจากระบบ",
         icon: "i-heroicons-arrow-left-start-on-rectangle",
         click: () => {
            setDialog(true);
         },
      },
   ],
];

const isLoading = ref(false);
const fnLogout = async () => {
   isLoading.value = true;
   const res = await logout();
   if (res.code == 20000) {
      const token = useCookie("swuNurseAccessToken");
      token.value = null;
      store.setProfile({});
      navigateTo("/login");
   }
   isLoading.value = false;
};

const isOpen = ref(false);
const setDialog = (status) => {
   isOpen.value = status;
};

// const isOpenEditProfile = ref(false);
// const setDialogEditProfile = (status) => {
//    isOpenEditProfile.value = status;
// };

// const isOpenChangePassword = ref(false);
// const setDialogChangePassword = (status) => {
//    isOpenChangePassword.value = status;
// };
</script>
