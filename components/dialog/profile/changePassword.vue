<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'w-[95%] md:min-w-[600px]',
         rounded: 'rounded-3xl',
      }"
   >
      <div class="p-6">
         <p class="text-primary-500 text-xl">เปลี่ยนรหัสผ่าน</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form class="grid grid-cols-1 sm:grid-cols-none justify-center gap-y-3 sm:gap-2" @submit="submitForm">
            <div class="grid items-center sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right">รหัสผ่านใหม่<span class="text-red-500"> *</span> :</p>
               <Input
                  type="password"
                  placeholder="รหัสผ่านใหม่"
                  class="flex flex-col sm:w-[260px]"
                  v-model="form.pwd"
                  heightClass="h-[38px]"
                  :requireInput="{ required: true }"
               />
            </div>
            <div class="grid items-center sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right">ยืนยันรหัสผ่านใหม่<span class="text-red-500"> *</span> :</p>
               <Input
                  type="password"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  class="flex flex-col sm:w-[260px]"
                  v-model="form.newPwd"
                  heightClass="h-[38px]"
                  :requireInput="{ required: true }"
               />
            </div>
            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <ButtonSave />
               <ButtonCancel @click="setDialog(false)" />
            </div>
         </form>
      </div>
   </UModal>
   <Loading v-if="isLoading" />
</template>
<script setup>
import Input from "~/components/form/input";
import Loading from "~/components/loading";
import ButtonSave from "~/components/button/save";
import ButtonCancel from "~/components/button/cancel";
import useAuthAPI from "~/service/api/auth";
const { changePassword } = useAuthAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
});

const form = ref({
   pwd: "",
   newPwd: "",
});

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         form.value = {
            pwd: "",
            newPwd: "",
         };
      }
   }
);

const isLoading = ref(false);
const submitForm = async (e) => {
   e.preventDefault();
   isLoading.value = true;
   console.log(form.value);
   if (form.value.pwd && form.value.newPwd) {
      isLoading.value = true;
      // const res = await changePassword(form.value);
      // console.log(res);
      // if (res.code == 20000) {
      //    const token = useCookie("swuNurseAccessToken");
      //    token.value = res.responseObject.token;
      //    store.setProfile(res.responseObject.profile);
      //    navigateTo("/");
      // } else {
      //    messageError.value = res.message;
      //    formLogin.value.password = "";
      // }
      isLoading.value = false;
   }
   // if (formLogin.value.username && formLogin.value.password) {
   //    isLoading.value = true;
   //    // const res = await login(formLogin.value);
   //    // if (res.code == 20000) {
   //    //    props.setResponseLogin(res.responseObject);
   //    // } else {
   //    //    messageError.value = "";
   //    //    setDialog(true);
   //    // }
   //    // isLoading.value = false;
   // } else {
   //    messageError.value = "1234";
   // }
};
</script>
