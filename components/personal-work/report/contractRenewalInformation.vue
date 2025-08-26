<template>
   <div class="bg-primary-500 rounded-t-lg h-[38px] px-4 flex items-center justify-between">
      <h2 class="text-white text-xl">ข้อมูลการต่อสัญญา</h2>
      <ButtonAddWhite v-if="modePersonnel == 'edit'" @click="btnOpenForm('create')" />
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
            { key: 'dateContract', label: 'วันที่ทำสัญญา', class: 'min-w-[120px]' },
            { key: 'dateHired', label: 'วันที่จ้าง', class: 'min-w-[120px]' },
            { key: 'dateContractExpired', label: 'วันที่ครบสัญญา', class: 'min-w-[120px]' },
            { key: 'dateCreated', label: 'วันที่เพิ่มข้อมูล', class: 'min-w-[120px]' },
            { key: 'actions', label: 'จัดการ', class: 'w-10' },
         ]"
         :loading="isLoading"
         :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
         :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
         :progress="{ color: 'primary', animation: 'carousel' }"
         :rows="tableData"
      >
         <template #dateContract-data="{ row }">
            <p>{{ genTextDate({ date: row.dateContract, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
         </template>
         <template #dateHired-data="{ row }">
            <p>{{ genTextDate({ date: row.dateHired, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
         </template>
         <template #dateContractExpired-data="{ row }">
            <p>{{ genTextDate({ date: row.dateContractExpired, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
         </template>
         <template #dateCreated-data="{ row }">
            <p>{{ genTextDate({ date: row.dateCreated, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
         </template>
         <template #actions-data="{ row }">
            <MenuDropdown :menus="genMenuTable(row)" />
         </template>
      </UTable>
   </div>
   <DialogContractForm
      :isOpen="isOpen"
      :setDialog="setDialog"
      :actionMode="actionMode"
      :id="contractId"
      :setLoadingPage="setLoadingPage"
      :getListTable="getListTable"
      :personnelId="personnelId"
   />
   <DialogConfirm
      :isOpen="isOpenDelete"
      :setDialog="setDialogDelete"
      title="ลบข้อมูล"
      desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="fnDelete"
   />
   <Loading v-if="isLoading" />
</template>

<script setup>
import DialogContractForm from "~/components/dialog/personal-work/contractForm";
import ButtonAddWhite from "~/components/button/addWhite";
import MenuDropdown from "~/components/form/menu";
import Loading from "~/components/loading";
import DialogConfirm from "~/components/dialog/confirm";
import usePersonnelContractAPI from "~/service/api/personnel/contract";
const { fetchPersonnelContractList, deletePersonnelContract } = usePersonnelContractAPI;

const props = defineProps({
   modePersonnel: String,
   personnelId: String,
});

const tableData = ref([]);
const isLoading = ref(true);
onMounted(() => {
   getListTable();
});

const filters = ref({
   max: -1,
   offset: 0,
});

const getListTable = async () => {
   isLoading.value = true;
   const res = await fetchPersonnelContractList(props.personnelId, filters.value);
   isLoading.value = false;
   if (res.code == 20000) {
      tableData.value = res.responseObject.contracts;
   }
};

const isOpen = ref(false);
const setDialog = (status) => {
   isOpen.value = status;
};

const setLoadingPage = (status) => {
   isLoading.value = status;
};

const actionMode = ref("");
const btnOpenForm = (mode) => {
   if (mode == "create") {
      contractId.value = null;
   }
   actionMode.value = mode;
   setDialog(true);
};

const contractId = ref(null);
const genMenuTable = (row) => {
   let result = null;
   if (props.modePersonnel == "edit") {
      result = [
         [
            {
               label: "แก้ไข",
               icon: "i-heroicons-pencil-square",
               click: () => {
                  contractId.value = row.id;
                  btnOpenForm("edit");
               },
            },
         ],
         [
            {
               label: "ลบ",
               icon: "i-heroicons-trash",
               click: () => {
                  contractId.value = row.id;
                  setDialogDelete(true);
               },
            },
         ],
      ];
   } else {
      result = [
         [
            {
               label: "ดู",
               icon: "i-heroicons-eye",
               click: () => {
                  contractId.value = row.id;
                  btnOpenForm("view");
               },
            },
         ],
      ];
   }
   return result;
};

const isOpenDelete = ref(false);
const setDialogDelete = (status) => {
   isOpenDelete.value = status;
};

const fnDelete = async () => {
   isLoading.value = true;
   setDialogDelete(false);
   const res = await deletePersonnelContract(props.personnelId, contractId.value);
   if (res.code == 20000) {
      setDialog(false);
      const toast = useToast();
      toast.add({ title: res.message, color: "green" });
      await getListTable();
   }
   isLoading.value = false;
};
</script>
