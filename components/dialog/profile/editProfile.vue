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
         <p class="text-primary-500 text-xl">แก้ไขโปรไฟล์</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form class="grid grid-cols-1 sm:grid-cols-none justify-center gap-y-3 sm:gap-2" @submit="submitForm">
            <div class="grid items-center sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right">ชื่อ (ภาษาไทย)<span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="ชื่อ (ภาษาไทย)"
                  class="flex flex-col sm:w-[260px]"
                  v-model="form.firstname"
                  heightClass="h-[38px]"
                  :requireInput="{ required: true }"
               />
            </div>
            <div class="grid items-center sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right">นามสกุล (ภาษาไทย)<span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="นามสกุล (ภาษาไทย)"
                  class="flex flex-col sm:w-[260px]"
                  v-model="form.lastname"
                  heightClass="h-[38px]"
                  :requireInput="{ required: true }"
               />
            </div>
            <div class="grid items-center sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right">ชื่อล็อคอินเข้าใช้งาน :</p>
               <Input placeholder="ชื่อล็อคอินเข้าใช้งาน" class="flex flex-col sm:w-[260px]" heightClass="h-[38px]" disabled :value="store.profileUser.email" />
            </div>

            <div class="grid items-center sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right">ระดับการเข้าใช้งาน :</p>
               <USelectMenu
                  v-model="form.role"
                  :options="options"
                  placeholder="ระดับการเข้าใช้งาน"
                  searchable
                  searchable-placeholder="ค้นหาระดับการเข้าใช้งาน"
                  option-attribute="name"
                  by="id"
                  :search-attributes="['name']"
                  :ui="{
                     base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0',
                     rounded: 'rounded-lg',
                  }"
                  :uiMenu="{
                     ring: 'ring-gray-100',
                     option: {
                        active: 'bg-gray-50',
                     },
                     label: 'text-base',
                     input: 'border-gray-100 placeholder:text-gray-100',
                  }"
               >
               </USelectMenu>
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
import { useProfileStore } from "@/stores/index";
const store = useProfileStore();

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
});

const form = ref({
   firstname: "",
   lastname: "",
   role: "",
});

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         form.value.firstname = store.profileUser.firstname;
         form.value.lastname = store.profileUser.lastname;
      }
   }
);

const options = [
   { id: 1, name: "เจ้าหน้าที่ 1" },
   { id: 2, name: "เจ้าหน้าที่ 2" },
   { id: 3, name: "เจ้าหน้าที่ 3" },
   { id: 4, name: "เจ้าหน้าที่ 4" },
];

const isLoading = ref(false);
const submitForm = async (e) => {
   e.preventDefault();
   isLoading.value = true;
   console.log(form.value);
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
