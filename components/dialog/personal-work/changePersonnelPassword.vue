<template>
   <UModal
      :modelValue="isOpenChangePersonnelPassword"
      :ui="{
         container: 'items-center',
         width: 'w-[95%] md:min-w-[600px]',
         rounded: 'rounded-3xl',
      }"
   >
      <div class="p-6">
         <p class="text-primary-500 text-xl">เปลี่ยนรหัสผ่าน</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form class="grid grid-cols-1 sm:grid-cols-none justify-center gap-y-3 sm:gap-2">
            <div class="grid sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="pt-2 text-sm sm:text-right">รหัสผ่านใหม่<span class="text-red-500"> *</span> :</p>
               <Input
                  type="password"
                  placeholder="รหัสผ่านใหม่"
                  class="text-sm flex flex-col sm:w-[260px]"
                  v-model="form.password"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.password?.showMessage, message: validator.password?.message }"
                  @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'password' })"
               />
            </div>
            <div class="grid sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="pt-2 text-sm sm:text-right">ยืนยันรหัสผ่านใหม่<span class="text-red-500"> *</span> :</p>
               <Input
                  type="password"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  class="text-sm flex flex-col sm:w-[260px]"
                  v-model="form.confirmPassword"
                  heightClass="h-[38px]"
                  :requireInput="{
                     showMessage: form.confirmPassword && form.password !== form.confirmPassword ? true : validator.confirmPassword?.showMessage,
                     message:
                        form.confirmPassword && form.password !== form.confirmPassword ? 'รหัสผ่านไม่ตรงกัน' : validator.confirmPassword?.message,
                  }"
                  @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'confirmPassword' })"
               />
            </div>
            <div class="bg-red-100 py-2 px-4 flex justify-between items-center rounded-md mt-3" v-if="messageError">
               <p class="text-sm text-red-600">{{ messageError }}</p>
               <div class="py-1 flex" @click="messageError = ''">
                  <UIcon name="i-heroicons-x-mark" class="text-red-600 w-5 h-5 cursor-pointer" />
               </div>
            </div>
            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <ButtonSave @click="submitForm" />
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

import useReportAPI from "~/service/api/report";
const { changePersonnelPassword } = useReportAPI;

const props = defineProps({
   isOpenChangePersonnelPassword: Boolean,
   setDialog: Function,
   personnelId: String,
});

const form = ref({
   password: "",
   confirmPassword: "",
});
const validator = ref({
   password: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   confirmPassword: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
});
const resetForm = () => {
   form.value = {
      password: "",
      confirmPassword: "",
   };
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
   messageError.value = "";
};
watch(
   () => props.isOpenChangePersonnelPassword,
   (newData) => {
      if (newData === true) {
         resetForm();
      }
   }
);

const messageError = ref("");
const isLoading = ref(false);
const submitForm = async () => {
   const fail = validatorForm(form.value, validator.value);

   if (form.value.password !== form.value.confirmPassword) {
      fail.push("confirmPassword");
   }

   if (fail.length == 0) {
      isLoading.value = true;
      const res = await changePersonnelPassword(props.personnelId, form.value);
      if (res.code === 20000) {
         const toast = useToast();
         toast.add({ title: res.message, color: "green" });
         props.setDialog(false, "changePersonnelPassword");
      } else {
         messageError.value = res.message;
      }
      isLoading.value = false;
   }
};
const clearRequireOnChange = (options) => {
   if (validator.value[options.key]) {
      let isShow = null;
      if (options.type == "array") {
         if (options.value.length > 0) {
            isShow = false;
         }
      } else {
         if (options.value) {
            isShow = false;
         }
      }
      validator.value[options.key].showMessage = isShow;

      const regexPassword = /^.{8,20}$/;
      if (options.key === "password") {
         if (form.value.password && !regexPassword.test(form.value.password)) {
            validator.value.password.showMessage = true;
            validator.value.password.message = "รหัสผ่านต้องอยู่ระหว่าง 8-20 ตัว";
         }
         if (!form.value.password) {
            validator.value.password.showMessage = true;
            validator.value.password.message = "กรอกข้อมูลไม่ครบถ้วน";
         }
      }
   }
};
</script>
