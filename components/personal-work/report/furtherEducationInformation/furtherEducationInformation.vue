<template>
   <div class="bg-primary-500 rounded-t-lg h-[38px] px-4 flex items-center justify-between">
      <h2 class="text-white text-xl">ข้อมูลการศึกษาต่อ</h2>
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
            { key: 'educationYear', label: 'ปีการศึกษา', class: 'min-w-[100px]' },
            {
               key: 'contractNumber',
               label: 'เลขที่สัญญา',
               class: 'min-w-[120px]',
            },
            {
               key: 'educationLevel',
               label: 'ระดับการศึกษา',
               class: 'min-w-[120px]',
            },
            {
               key: 'educationCertifiation',
               label: 'วุฒิการศึกษา',
               class: 'min-w-[120px]',
            },
            {
               key: 'dateLeaveEducationStart',
               label: 'ช่วงวันที่ลาศึกษา',
               class: 'min-w-[180px]',
            },
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
         <template #dateLeaveEducationStart-data="{ row }">
            <div class="flex gap-1">
               <p>{{ genTextDate({ date: row.dateLeaveEducationStart, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
               <span>-</span>
               <p>{{ genTextDate({ date: row.dateLeaveEducationEnd, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
            </div>
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
      :btnAction="handleDeletePersonnelEducationAdditional"
   />
   <DialogfurtherEducationInformationForm
      :isOpen="isDialogEducationalAdditionalFormOpen"
      :setDialog="setDialogEducationalAdditionalForm"
      :personnelId="personnelId"
      :educationAdditionalId="educationAdditionalId"
      :educationAdditionalIdDefault="educationAdditionalIdDefault"
      :openDialogMode="openDialogMode"
   />
</template>

<script setup>
import DialogConfirm from "~/components/dialog/confirm";
import DialogfurtherEducationInformationForm from "~/components/dialog/personal-work/furtherEducationInformation/furtherEducationInformationForm";
import ButtonAddWhite from "~/components/button/addWhite";
import MenuDropdown from "~/components/form/menu";

import usePersonnelEducationAdditionalAPI from "~/service/api/personnelEducationAdditional";
const { fetchPersonnelEducationAdditionalList, deletePersonnelEducationAdditional } = usePersonnelEducationAdditionalAPI;

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
const educationAdditionalId = ref(null);
const educationAdditionalIdDefault = ref(null);
const genMenuTable = (row) => {
   let result = [];
   if (props.mode === "view") {
      result = [
         [
            {
               label: "ดู",
               icon: "i-heroicons-eye",
               click: () => {
                  educationAdditionalId.value = row.id;
                  educationAdditionalIdDefault.value = row.id;
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
                  educationAdditionalId.value = row.id;
                  educationAdditionalIdDefault.value = row.id;
                  btnOpenForm("edit");
               },
            },
         ],
         [
            {
               label: "ลบ",
               icon: "i-heroicons-trash",
               click: () => {
                  educationAdditionalId.value = row.id;
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
   const res = await fetchPersonnelEducationAdditionalList(props?.personnelId, filters.value);
   if (res?.code === 20000) {
      personnels.value = res.responseObject.educations;
      total.value = res.responseObject.total;
   }
   isLoading.value = false;
};

const changePage = (pageNum) => {
   filters.value.currentPage = pageNum;
   filters.value.offset = filters.value.max * (pageNum - 1);
   getListTable();
};

const isDialogEducationalAdditionalFormOpen = ref(false);
const setDialogEducationalAdditionalForm = (status, type) => {
   isDialogEducationalAdditionalFormOpen.value = status;
   if (type === "toEditMode") {
      openDialogMode.value = "edit";
      setDialogEducationalAdditionalForm(true);
   }
   if (type === "refresh") {
      getListTable();
   }
};
const isDialogConfirmOpen = ref(false);
const setDialogConfirm = (status, type) => {
   isDialogConfirmOpen.value = status;
};

const btnOpenForm = (mode) => {
   openDialogMode.value = mode;
   setDialogEducationalAdditionalForm(true);
};

const handleDeletePersonnelEducationAdditional = async () => {
   isLoading.value = true;
   const res = await deletePersonnelEducationAdditional(props?.personnelId, educationAdditionalId?.value);
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
