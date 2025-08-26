<template>
   <div class="bg-primary-500 rounded-t-lg h-[38px] px-4 flex items-center justify-between">
      <h2 class="text-white text-xl">ข้อมูลการถือครองอัตราปัจจุบัน</h2>
      <ButtonAddWhite v-if="mode === 'edit'" @click="btnOpenForm('create')" />
   </div>
   <div class="bg-white px-[26px] py-8">
      <UTable
         :ui="{
            wrapper: 'rounded-t-lg',
            thead: 'bg-primary-50',
            th: {
               padding: 'py-2.5',
               size: 'text-xs [&_span]:font-sarabun-bold',
            },
            tbody: 'border-none divide-none odd:[&_tr]:bg-white even:[&_tr]:bg-gray-50',
            td: {
               padding: 'py-2.5',
               color: 'text-black',
            },
            default: {
               sortButton: {
                  class: '[&:nth-child(2)]:[&_span]:text-primary-500 px-0 hover:bg-transparent',
               },
            },
         }"
         :sortButton="{
            size: 'xs',
         }"
         :columns="[
            { key: 'currencyNo', label: 'เลขอัตรา', class: 'min-w-[100px]' },
            { key: 'currencyType', label: 'ประเภทอัตรา', class: 'min-w-[120px]' },
            { key: 'division', label: 'สังกัด', class: 'min-w-[120px]' },
            { key: 'position', label: 'ตำแหน่ง', class: 'min-w-[120px]' },
            {
               key: 'agency',
               label: 'หน่วยงานที่ปฏิบัติงาน',
               class: 'min-w-[120px]',
            },
            { key: 'salary', label: 'เงินเดือน', class: 'min-w-[120px]' },
            { key: 'dateCreated', label: 'วันที่เพิ่มข้อมูล', class: 'min-w-[120px]' },
            { key: 'actions', label: 'Action', class: 'min-w-10' },
         ]"
         :loading="isLoading"
         :loading-state="{
            icon: 'i-heroicons-arrow-path-20-solid',
            label: 'กำลังโหลด...',
         }"
         :empty-state="{
            icon: 'i-heroicons-circle-stack-20-solid',
            label: 'ไม่มีข้อมูล',
         }"
         :progress="{ color: 'primary', animation: 'carousel' }"
         :rows="personnels"
      >
         <template #currencyNo-data="{ row }">
            <p>{{ row.currencyNo }}</p>
         </template>
         <template #dateCreated-data="{ row }">
            <p>{{ genTextDate({ date: row.dateCreated, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
         </template>
         <template #actions-data="{ row }">
            <MenuDropdown :menus="genMenuTable(row)" />
         </template>
      </UTable>
   </div>
   <DialogConfirm
      :isOpen="isDialogConfirmOpen"
      :setDialog="setDialogConfirm"
      title="ลบไฟล์"
      desc="คุณต้องการลบไฟล์นี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="handleDeletePersonnelCurrency"
   />
   <DialogCurrentRateHoldingInformationForm
      :isOpen="isDialogCurrentRateHoldingFormOpen"
      :setDialog="setDialogCurrentRateHoldingForm"
      :personnelId="personnelId"
      :currencyId="currencyId"
      :openDialogMode="openDialogMode"
   />
</template>

<script setup>
import DialogConfirm from "~/components/dialog/confirm";
import DialogCurrentRateHoldingInformationForm from "~/components/dialog/personal-work/currentRateHoldingInformationForm";
import ButtonAddWhite from "~/components/button/addWhite";
import MenuDropdown from "~/components/form/menu";

import usePersonnelCurrencyAPI from "~/service/api/personnelCurrency";
const { fetchPersonnelCurrency, deletePersonnelCurrency } = usePersonnelCurrencyAPI;

const toast = useToast();
const props = defineProps({
   personnelId: String,
   mode: String,
});
const personnels = ref([]);
const total = ref(0);
const openDialogMode = ref(null);
const isLoading = ref(true);
const filters = ref({
   max: -1,
   offset: 0,
   currentPage: 1,
});

onMounted(() => {
   getListTable();
});

const personnelId = ref(props.personnelId);
const currencyId = ref(null);
const genMenuTable = (row) => {
   let result = [];
   if (props.mode === "view") {
      result = [
         [
            {
               label: "ดู",
               icon: "i-heroicons-eye",
               click: () => {
                  currencyId.value = row.id;
                  btnOpenForm("view");
               },
            },
         ],
      ];
   } else if (props.mode === "edit") {
      result = [
         [
            {
               label: "แก้ไข",
               icon: "i-heroicons-pencil-square",
               click: () => {
                  currencyId.value = row.id;
                  btnOpenForm("edit");
               },
            },
         ],
         [
            {
               label: "ลบ",
               icon: "i-heroicons-trash",
               click: () => {
                  currencyId.value = row.id;
                  setDialogConfirm(true);
               },
            },
         ],
      ];
   }
   return result;
};

const getListTable = async () => {
   isLoading.value = true;
   const res = await fetchPersonnelCurrency(props.personnelId, filters.value);
   if (res?.code === 20000) {
      personnels.value = res.responseObject.currencyList;
      total.value = res.responseObject.total;
   }
   isLoading.value = false;
};

const isDialogCurrentRateHoldingFormOpen = ref(false);
const setDialogCurrentRateHoldingForm = (status, type) => {
   isDialogCurrentRateHoldingFormOpen.value = status;
   if (type === "toEditMode") {
      openDialogMode.value = "edit";
      setDialogCurrentRateHoldingForm(true);
   }
   if (type === "refresh") {
      getListTable();
   }
};
const isDialogConfirmOpen = ref(false);
const setDialogConfirm = (status) => {
   isDialogConfirmOpen.value = status;
};

const btnOpenForm = (mode) => {
   openDialogMode.value = mode;
   setDialogCurrentRateHoldingForm(true);
};

const handleDeletePersonnelCurrency = async () => {
   isLoading.value = true;
   const res = await deletePersonnelCurrency(props?.personnelId, currencyId?.value);
   if (res?.code === 20000) {
      toast.add({ title: res?.message, color: "green" });
      getListTable();
      setDialogConfirm(false);
   } else {
      toast.add({ title: res?.message, color: "red" });
   }
   isLoading.value = false;
};
</script>