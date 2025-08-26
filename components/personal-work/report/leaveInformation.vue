<template>
   <div class="bg-primary-500 rounded-t-lg h-[38px] px-4 flex items-center justify-between">
      <h2 class="text-white text-xl">ข้อมูลการลา</h2>
      <ButtonAddWhite v-if="modePersonnel == 'edit'" @click="btnOpenForm('create')" />
   </div>
   <div class="bg-white px-[26px] py-8">
      <UTable :ui="{
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
      }" :sortButton="{
         size: 'xs',
      }" :columns="[
            { key: 'leaveType', label: 'ประเภทการลา', class: 'min-w-[150px]' },
            { key: 'dateLeaveStart', label: 'วันที่ลา', class: 'min-w-[190px]' },
            { key: 'remark', label: 'หมายเหตุ', class: 'min-w-[150px]' },
            { key: 'dateCreated', label: 'วันที่เพิ่มข้อมูล', class: 'min-w-[120px]' },
            { key: 'actions', label: 'จัดการ', class: 'w-10' },
         ]" :loading="isLoading" :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
         :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
         :progress="{ color: 'primary', animation: 'carousel' }" :rows="tableData">
         <template #dateLeaveStart-data="{ row }">
            <div class="flex gap-x-1">
               <p>{{ genTextDate({
                  date: row.dateLeaveStart,
                  format: `${row.leaveRangeType === 1 ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm'}`,
                  isBuddhistYear: false
               }) || "-" }}
               </p>
               <p>-</p>
               <p>{{ genTextDate({
                  date: row.dateLeaveEnd, format: `${row.leaveRangeType === 1 ? 'DD/MM/YYYY' :
                     'DD/MM/YYYY HH:mm'}`, isBuddhistYear: false
               }) || "-"
                  }}</p>
            </div>
         </template>
         <template #remark-data="{ row }">
            <p>{{ row.remark || "-" }}</p>
         </template>
         <template #dateCreated-data="{ row }">
            <p>{{ genTextDate({ date: row.dateCreated, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
         </template>
         <template #actions-data="{ row }">
            <MenuDropdown :menus="genMenuTable(row)" />
         </template>
      </UTable>
   </div>
   <DialogLeaveForm :isOpen="isOpen" :setDialog="setDialog" :actionMode="actionMode" :id="leaveId"
      :setLoadingPage="setLoadingPage" :getListTable="getListTable" :personnelId="personnelId" />
   <DialogConfirm :isOpen="isOpenDelete" :setDialog="setDialogDelete" title="ลบข้อมูล"
      desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก" icon="danger"
      :btnAction="fnDelete" />
   <Loading v-if="isLoading" />
</template>

<script setup>
import DialogLeaveForm from "~/components/dialog/personal-work/leaveForm";
import ButtonAddWhite from "~/components/button/addWhite";
import MenuDropdown from "~/components/form/menu";
import Loading from "~/components/loading";
import DialogConfirm from "~/components/dialog/confirm";
import usePersonnelLeaveAPI from "~/service/api/personnel/leave";
const { fetchPersonnelLeaveList, deletePersonnelLeave } = usePersonnelLeaveAPI;

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
   const res = await fetchPersonnelLeaveList(props.personnelId, filters.value);
   if (res.code == 20000) {
      tableData.value = res.responseObject.leaves;
   }
   isLoading.value = false;
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
      leaveId.value = null;
   }
   actionMode.value = mode;
   setDialog(true);
};

const leaveId = ref(null);
const genMenuTable = (row) => {
   let result = null;
   if (props.modePersonnel == "edit") {
      result = [
         [
            {
               label: "แก้ไข",
               icon: "i-heroicons-pencil-square",
               click: () => {
                  leaveId.value = row.id;
                  btnOpenForm("edit");
               },
            },
         ],
         [
            {
               label: "ลบ",
               icon: "i-heroicons-trash",
               click: () => {
                  leaveId.value = row.id;
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
                  leaveId.value = row.id;
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
   const res = await deletePersonnelLeave(props.personnelId, leaveId.value);
   if (res.code == 20000) {
      setDialog(false);
      const toast = useToast();
      toast.add({ title: res.message, color: "green" });
      await getListTable();
   }
   isLoading.value = false;
};
</script>
