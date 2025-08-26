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
         <p class="text-primary-500 text-xl">โปรดเลือกสิทธิ์ผู้ใช้</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form class="grid grid-cols-1 sm:grid-cols-none justify-center gap-y-3 sm:gap-2" @submit.prevent="submitForm">
            <div class="grid items-center sm:items-start sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right mt-0 sm:mt-2">สิทธิ์ผู้ใช้<span class="text-red-500"> *</span> :</p>
               <Select
                  class="w-full sm:w-[260px]"
                  v-model="form.roleId"
                  :options="roles"
                  attributeValue="id"
                  attributeOption="name"
                  placeholder="-- เลือก --"
                  searchablePlaceholder="ค้นหาระดับผู้ใช้งาน"
                  :requireInput="{ showMessage: validator.roleId?.showMessage, message: validator.roleId?.message }"
               />
            </div>
            <div class="grid items-center sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <div></div>
               <Input
                  :value="`${tempLogin.profile?.firstname} ${tempLogin.profile?.lastname}`"
                  class="flex flex-col sm:w-[260px]"
                  heightClass="h-[38px]"
                  readonly
                  disabled
               />
            </div>
            <div class="bg-red-100 py-2 px-4 flex justify-between items-center rounded-md mt-3" v-if="messageError">
               <p class="text-sm text-red-600">{{ messageError }}</p>
               <div class="py-1 flex" @click="messageError = ''">
                  <UIcon name="i-heroicons-x-mark" class="text-red-600 w-5 h-5 cursor-pointer" />
               </div>
            </div>
            <div :class="[messageError ? 'mt-3' : 'mt-8', 'flex flex-wrap gap-2 justify-center']">
               <UButton size="xl" color="primary" variant="solid" label="เข้าสู่ระบบ" block class="rounded-lg w-full h-10 sm:w-[108px] text-sm" type="submit" />
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
import ButtonCancel from "~/components/button/cancel";
import Select from "~/components/form/select";
import useAuthAPI from "~/service/api/auth";
const { fetchRolesListFirst, updateRoleFirst } = useAuthAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   tempLogin: Object,
   setTokenAndLogin: Function,
});

const removeAutoFocus = ref(null);

const form = ref({
   roleId: 0,
});

const validator = ref({});
const roles = ref([]);

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         form.value = {
            roleId: 0,
         };
         validator.value = {
            roleId: {
               showMessage: false,
               message: "จำเป็นต้องเลือก",
            },
         };
         getRolesList();
      }
   }
);

const getRolesList = async () => {
   const res = await fetchRolesListFirst(props.tempLogin.token);
   if (res.code == 20000) {
      roles.value = res.responseObject.roles;
   }
};

const isLoading = ref(false);
const messageError = ref("");
const submitForm = async () => {
   const fail = validatorForm(form.value, validator.value);
   if (fail.length == 0) {
      isLoading.value = true;
      const req = {
         roleId: form.value.roleId,
         tokenTemp: props.tempLogin.token,
      };
      const res = await updateRoleFirst(req);
      if (res.code == 20000) {
         props.setTokenAndLogin(props.tempLogin.token, props.tempLogin.profile);
      } else {
         messageError.value = res.message;
      }
      isLoading.value = false;
   }
};

watch(
   () => form.value.roleId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "roleId" });
   }
);
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
