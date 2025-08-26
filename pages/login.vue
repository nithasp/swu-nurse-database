<template>
   <main class="h-full overflow-auto lg:overflow-hidden bg-[url('~/assets/images/login/bg.jpg')] bg-cover bg-center relative px-3 sm:px-0">
      <div class="gird min-h-screen content-center mb-6 sm:mb-0">
         <img :src="Logo" alt="Logo SWU" class="m-auto w-[360px] mb-3" />
         <div class="w-[95%] sm:w-[652px] h-auto rounded-3xl bg-white m-auto p-6">
            <form class="grid justify-center w-full h-full content-center relative" @submit.prevent="submitForm">
               <p class="font-srinakharinwirot text-[32px] text-primary text-center">ยินดีต้อนรับเข้าสู่</p>
               <h1
                  class="font-srinakharinwirot text-[28px] mb-6 text-center sm:whitespace-pre-line"
                  v-text="'ระบบเพื่อการบริหารและตัดสินใจ \n คณะพยาบาลศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ'"
               ></h1>
               <div class="mb-3">
                  <Input
                     label="ชื่อผู้ใช้งาน"
                     :icon="true"
                     placeholder="กรุณากรอกชื่อผู้ใช้"
                     class="flex flex-col"
                     v-model="formLogin.username"
                     :requireInput="{ showMessage: validator.username?.showMessage, message: validator.username?.message }"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'username' })"
                  >
                     <template #icon>
                        <UserIcon size="20" stroke="#636466" />
                     </template>
                  </Input>
               </div>

               <Input
                  type="password"
                  label="รหัสผ่าน"
                  :icon="true"
                  placeholder="กรุณากรอกรหัสผ่าน"
                  class="mb-7 flex flex-col"
                  v-model="formLogin.password"
                  :requireInput="{ showMessage: validator.password?.showMessage, message: validator.password?.message }"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'password' })"
                  @keypress="inputNoSpace($event)"
               >
                  <template #icon>
                     <UnLockIcon />
                  </template>
               </Input>

               <BadgeError v-if="messageError" :action="() => (messageError = '')" :message="messageError" />

               <UButton size="xl" color="primary" variant="solid" label="เข้าสู่ระบบ" block class="rounded-lg mt-6 mb-10 text-sm" type="submit" />

               <span class="text-xs absolute left-1/2 bottom-0 translate-x-[-50%] text-gray-500">Version {{ config.public.version }}</span>
            </form>
         </div>
      </div>
   </main>
   <Loading v-if="isLoading" />
   <DialogFirstLogin :isOpen="isOpenFirstLogin" :setDialog="setDialogFirstLogin" :setDialogRole="setDialogRole" :tempLogin="tempLogin" />
   <DialogRole :isOpen="isOpenRole" :setDialog="setDialogRole" :setTokenAndLogin="setTokenAndLogin" :tempLogin="tempLogin" />
</template>

<script setup>
import Logo from "~/assets/images/login/logo.svg";
import Input from "~/components/form/input";
import Loading from "~/components/loading";
import UserIcon from "~/assets/icons/user";
import UnLockIcon from "~/assets/icons/unlock";
import DialogFirstLogin from "~/components/dialog/login/firstLogin";
import DialogRole from "~/components/dialog/login/role";
import BadgeError from "~/components/badge/error";
import useAuthAPI from "~/service/api/auth";
const { login } = useAuthAPI;
import { useProfileStore } from "@/stores/index";
const store = useProfileStore();

definePageMeta({
   layout: false,
});

const config = useRuntimeConfig();

const formLogin = ref({
   username: "",
   password: "",
});

const validator = ref({
   username: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   password: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
});

const messageError = ref("");
const isLoading = ref(false);
const tempLogin = ref({});
const submitForm = async () => {
   const fail = validatorForm(formLogin.value, validator.value);
   if (fail.length == 0) {
      isLoading.value = true;
      messageError.value = "";
      const res = await login(formLogin.value);
      if (res.code == 20000) {
         const { setFirstTimePass, profile, token, roles } = res.responseObject;
         if (setFirstTimePass) {
            if (roles.length == 1) {
               setTokenAndLogin(token, profile);
            } else {
               tempLogin.value = {
                  token,
                  profile,
               };
               setDialogRole(true);
            }
         } else {
            tempLogin.value = {
               token,
               profile,
            };
            setDialogFirstLogin(true);
         }
      } else {
         messageError.value = res.message;
         formLogin.value.password = "";
      }
      isLoading.value = false;
   }
};

const isOpenFirstLogin = ref(false);
const setDialogFirstLogin = (status) => {
   isOpenFirstLogin.value = status;
};

const isOpenRole = ref(false);
const setDialogRole = (status) => {
   isOpenRole.value = status;
};

const setTokenAndLogin = (token, profile) => {
   const setToken = useCookie("swuNurseAccessToken");
   setToken.value = token;
   store.setProfile(profile);
   navigateTo("/");
};

const clearRequireOnChange = (validator, options) => {
   if (validator[options.key]) {
      let isShow = null;
      if (options.value) {
         isShow = false;
      }
      validator[options.key].showMessage = isShow;
   }
};
</script>
