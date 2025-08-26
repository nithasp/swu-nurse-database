<template>
   <div class="bg-primary-500 rounded-t-lg h-[38px] px-4 flex items-center justify-between">
      <h2 class="text-white text-xl">รายงานความก้าวหน้าการลาศึกษาต่อ</h2>
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
            {
               key: 'dateReported',
               label: 'วันที่รายงาน',
               class: 'min-w-[120px]',
            },
            {
               key: 'educationYearLevel',
               label: 'ปีที่ศึกษาต่อ',
               class: 'min-w-24',
            },
            {
               key: 'reportTopic',
               label: 'หัวข้อรายงาน',
               class: 'min-w-[120px]',
            },
            {
               key: 'detail',
               label: 'รายละเอียดความก้าวหน้า',
               class: 'min-w-[180px]',
            },
            {
               key: 'dateCreated',
               label: 'วันที่เพิ่มข้อมูล',
               class: 'min-w-32',
            },
            { key: 'actions', label: 'Action', class: 'min-w-[120px]' },
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
         <template #dateReported-data="{ row }">
            <p>{{ genTextDate({ date: row.dateReported, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
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
      :btnAction="handleDeletePersonnelEducationAdditionalProgress"
   />
   <DialogfurtherEducationInformationProgressForm
      :isOpen="isDialogEducationalAdditionalProgressFormOpen"
      :setDialog="setDialogEducationalAdditionalProgressForm"
      :personnelId="personnelId"
      :educationAdditionalId="educationAdditionalProgressId"
      :educationAdditionalIdDefault="educationAdditionalIdDefault"
      :openDialogMode="openDialogMode"
   />
</template>

<script setup>
import DialogConfirm from "~/components/dialog/confirm";
import DialogfurtherEducationInformationProgressForm from "~/components/dialog/personal-work/furtherEducationInformation/furtherEducationInformationProgressForm";
import ButtonAddWhite from "~/components/button/addWhite";
import MenuDropdown from "~/components/form/menu";

import usePersonnelEducationAdditionalProgressAPI from "~/service/api/personnelEducationAdditionalProgress";
const { fetchPersonnelEducationAdditionalProgressList, deletePersonnelEducationAdditionalProgress } = usePersonnelEducationAdditionalProgressAPI;

const toast = useToast();
const props = defineProps({
   personnelId: String,
   educationAdditionalId: Number,
   educationAdditionalIdDefault: Number,
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
   educationAdditionalProgressId.value = props.educationAdditionalId;
   educationAdditionalIdDefault.value = props.educationAdditionalIdDefault;
});

const personnelId = ref(props?.personnelId);
const educationAdditionalProgressId = ref(null);
const educationAdditionalIdDefault = ref(null);
const genMenuTable = (row) => {
   let result = [];
   if (props?.mode === "view") {
      result = [
         [
            {
               label: "ดู",
               icon: "i-heroicons-eye",
               click: () => {
                  educationAdditionalProgressId.value = row.id;
                  btnOpenForm("view");
               },
            },
         ],
      ];
   } else if (props?.mode === "edit") {
      result = [
         [
            {
               label: "แก้ไข",
               icon: "i-heroicons-pencil-square",
               click: () => {
                  educationAdditionalProgressId.value = row.id;
                  btnOpenForm("edit");
               },
            },
         ],
         [
            {
               label: "ลบ",
               icon: "i-heroicons-trash",
               click: () => {
                  educationAdditionalProgressId.value = row.id;
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
   const res = await fetchPersonnelEducationAdditionalProgressList(props?.personnelId, props?.educationAdditionalId, filters.value);
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

const isDialogEducationalAdditionalProgressFormOpen = ref(false);
const setDialogEducationalAdditionalProgressForm = (status, type) => {
   isDialogEducationalAdditionalProgressFormOpen.value = status;
   if (type === "toEditMode") {
      openDialogMode.value = "edit";
      setDialogEducationalAdditionalProgressForm(true);
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
   setDialogEducationalAdditionalProgressForm(true);
};

const handleDeletePersonnelEducationAdditionalProgress = async () => {
   isLoading.value = true;
   const res = await deletePersonnelEducationAdditionalProgress(props?.personnelId, educationAdditionalProgressId.value);
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