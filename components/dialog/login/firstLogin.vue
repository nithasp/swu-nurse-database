<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'w-[95%] md:min-w-[600px]',
         rounded: 'rounded-3xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6">
         <p class="text-primary-500 text-xl">โปรดเปลี่ยนรหัสผ่านสำหรับเข้าใช้ครั้งแรก</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form class="grid grid-cols-1 sm:grid-cols-none justify-center gap-y-3 sm:gap-2" @submit.prevent="submitForm">
            <div class="grid items-center sm:items-start sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right mt-0 sm:mt-2">รหัสผ่านใหม่<span class="text-red-500"> *</span> :</p>
               <Input
                  type="password"
                  placeholder="รหัสผ่านใหม่"
                  class="flex flex-col sm:w-[260px]"
                  v-model="form.password"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.password?.showMessage, message: validator.password?.message }"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'password' })"
                  @keypress="inputNoSpace($event)"
               />
            </div>
            <div class="grid items-center sm:items-start sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right mt-0 sm:mt-2">ยืนยันรหัสผ่านใหม่<span class="text-red-500"> *</span> :</p>
               <Input
                  type="password"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  class="flex flex-col sm:w-[260px]"
                  v-model="form.confirmPassword"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.confirmPassword?.showMessage, message: validator.confirmPassword?.message }"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'confirmPassword' })"
                  @keypress="inputNoSpace($event)"
               />
            </div>
            <div class="bg-red-100 py-2 px-4 flex justify-between items-center rounded-md mt-3" v-if="messageError">
               <p class="text-sm text-red-600">{{ messageError }}</p>
               <div class="py-1 flex" @click="messageError = ''">
                  <UIcon name="i-heroicons-x-mark" class="text-red-600 w-5 h-5 cursor-pointer" />
               </div>
            </div>
            <div :class="[messageError ? 'mt-3' : 'mt-8', 'flex flex-wrap gap-2 justify-center']">
               <ButtonSave type="submit" />
               <ButtonCancel @click="setDialog(false)" ref="removeAutoFocus" />
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
const { changePasswordFirst } = useAuthAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   setDialogRole: Function,
   tempLogin: Object,
   setTokenAndLogin: Function,
});

const removeAutoFocus = ref(null);

const form = ref({
   password: "",
   confirmPassword: "",
});
const validator = ref({});

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         form.value = {
            password: "",
            confirmPassword: "",
         };
         messageError.value = "";
         validator.value = {
            password: {
               showMessage: false,
               message: "กรอกข้อมูลไม่ครบถ้วน",
            },
            confirmPassword: {
               showMessage: false,
               message: "กรอกข้อมูลไม่ครบถ้วน",
            },
         };
      }
   }
);

const messageError = ref("");
const isLoading = ref(false);
const submitForm = async () => {
   const fail = validatorForm(form.value, validator.value);
   if (fail.length == 0) {
      const { password, confirmPassword } = form.value;
      if (password !== confirmPassword) {
         messageError.value = "รหัสผ่านไม่ตรงกัน";
      } else {
         isLoading.value = true;
         const req = {
            password,
            confirmPassword,
            tokenTemp: props.tempLogin.token,
         };
         const res = await changePasswordFirst(req);
         if (res.code == 20000) {
            props.setDialog(false);
            props.setDialogRole(true);
         } else {
            messageError.value = res.message;
         }
         isLoading.value = false;
      }
   }
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
