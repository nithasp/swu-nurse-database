<template>
   <div class="p-1.5">
      <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
         <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
            <img :src="MasterCircleIcon" alt="Icon" />
            <h1 class="text-xl">ประเภทสิ่งประดิษฐ์</h1>
         </div>
         <ButtonAdd @click="btnOpenForm('create')" />
      </div>
      <div class="bg-white rounded-lg p-4">
         <form class="flex items-end justify-between flex-wrap gap-y-3" @submit="reloadTable">
            <div class="flex items-center gap-3 flex-wrap">
               <div class="w-full sm:w-[280px]">
                  <p class="text-sm mb-1.5 text-gray-400">ค้นหา</p>
                  <Input v-model="filters.keyword" placeholder="ค้นหา" class="flex flex-col w-full text-sm" heightClass="h-[38px]" />
               </div>
            </div>
            <div class="flex gap-3">
               <ButtonSearch type="submit" />
               <ButtonClear @click="btnClear" />
            </div>
         </form>
      </div>
      <div class="bg-white rounded-lg p-4 mt-4">
         <div class="flex gap-3 items-center mb-4">
            <SelectShowList :setShowList="setShowList" />
            <p class="text-gray-400 text-sm">{{ formatCurrency(total) }} รายการ</p>
         </div>
         <UTable
            class="w-full"
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
               { key: 'order', label: 'ลำดับ', class: 'min-w-[65px] text-center' },
               { key: 'nameTh', label: 'รายการประเภทสิ่งประดิษฐ์', class: 'min-w-[200px]', sortable: true },
               { key: 'dateUpdated', label: 'วันที่แก้ไขข้อมูล', class: 'min-w-[160px]' },
               { key: 'actions', label: 'จัดการ', class: 'min-w-[40px]' },
            ]"
            :loading="isLoading"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
            :progress="{ color: 'primary', animation: 'carousel' }"
            :rows="tableData"
         >
            <template #order-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.order) }}</p>
            </template>
            <template #name-data="{ row }">
               <div class="max-w-[200px] line-clamp-2">
                  {{ row.name }}
               </div>
            </template>
            <template #dateUpdated-data="{ row }">
               <p>{{ genTextDate({ date: row.dateUpdated, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}</p>
            </template>
            <template #actions-data="{ row }">
               <MenuDropdown :menus="genMenuTable(row)" />
            </template>
         </UTable>
      </div>
      <Pagination
         v-if="!isLoading && tableData.length > 0"
         class="mt-6"
         :total="total"
         :currentPage="filters.currentPage"
         :changePage="changePage"
         :limit="filters.max"
      />
   </div>
   <DialogInventionTypeForm
      :isOpen="isOpen"
      :setDialog="setDialog"
      :actionMode="actionMode"
      :id="masterId"
      :setLoadingPage="setLoadingPage"
      :getListTable="getListTable"
      :btnOpenForm="btnOpenForm"
   />
   <DialogConfirm
      :isOpen="isOpenConfirm"
      :setDialog="setDialogConfirm"
      title="ลบข้อมูล"
      desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="fnDelete"
   />
   <Loading v-if="isLoading" />
</template>
<script setup>
import MasterCircleIcon from "~/assets/icons/master-circle.svg";
import ButtonAdd from "~/components/button/add";
import ButtonSearch from "~/components/button/search";
import ButtonClear from "~/components/button/clear";
import SelectShowList from "~/components/form/selectShowList";
import Input from "~/components/form/input";
import DialogInventionTypeForm from "~/components/dialog/masterdata/inventionTypeForm";
import DialogConfirm from "~/components/dialog/confirm";
import Pagination from "~/components/pagination";
import MenuDropdown from "~/components/form/menu";
import Loading from "~/components/loading";

import useMasterInventionTypeAPI from "~/service/api/masterData/inventionType";
const { fetchMasterInventionTypeList, deleteInventionType } = useMasterInventionTypeAPI;

const filters = ref({
   keyword: "",
   max: 10,
   offset: 0,
   currentPage: 1,
});

const tableData = ref([]);
const isLoading = ref(true);
const total = ref(null);
onMounted(() => {
   getListTable();
});

const reloadTable = (e) => {
   e.preventDefault();
   clearPage();
};

const clearPage = () => {
   filters.value.currentPage = 1;
   filters.value.offset = 0;
   getListTable();
};

const getListTable = async () => {
   const res = await fetchMasterInventionTypeList(filters.value);
   if (res.code == 20000) {
      tableData.value = [];
      for (let i = 0; i < res.responseObject.inventionTypeList.length; i++) {
         const data = res.responseObject.inventionTypeList[i];
         data.order = filters.value.offset + (i + 1);
         tableData.value.push(data);
      }
      total.value = res.responseObject.total;
   }
   isLoading.value = false;
};

const setShowList = (listTotal) => {
   if (filters.value.max != listTotal) {
      filters.value.max = listTotal;
      clearPage();
   }
};

const btnClear = () => {
   filters.value = {
      keyword: "",
      max: 10,
      offset: 0,
      currentPage: 1,
   };
   getListTable();
};

const isOpen = ref(false);
const setDialog = (status) => {
   isOpen.value = status;
};

const isOpenConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenConfirm.value = status;
};

const actionMode = ref("");
const btnOpenForm = (mode) => {
   if (mode == "create") {
      masterId.value = null;
   }
   actionMode.value = mode;
   setDialog(true);
};

const masterId = ref(null);
const genMenuTable = (row) => {
   const result = [
      [
         {
            label: "ดู",
            icon: "i-heroicons-eye",
            click: () => {
               masterId.value = row.id;
               btnOpenForm("view");
            },
         },
         {
            label: "แก้ไข",
            icon: "i-heroicons-pencil-square",
            click: () => {
               masterId.value = row.id;
               btnOpenForm("edit");
            },
         },
      ],
      [
         {
            label: "ลบ",
            icon: "i-heroicons-trash",
            click: () => {
               masterId.value = row.id;
               setDialogConfirm(true);
            },
         },
      ],
   ];
   return result;
};

const fnDelete = async () => {
   isLoading.value = true;
   const res = await deleteInventionType(masterId.value);
   if (res.code == 20000) {
      setDialogConfirm(false);
      const toast = useToast();
      toast.add({ title: res.message, color: "green" });
      await getListTable();
   }
   isLoading.value = false;
};

const changePage = (pageNum) => {
   filters.value.currentPage = pageNum;
   filters.value.offset = filters.value.max * (pageNum - 1);
   getListTable();
};

const setLoadingPage = (status) => {
   isLoading.value = status;
};
</script>
